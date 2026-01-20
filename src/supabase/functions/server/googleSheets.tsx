interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// 캐시 저장소
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

/**
 * 캐시에서 데이터 가져오기
 */
export function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  console.log(`✅ 캐시 히트: ${key}`);
  return cached.data;
}

/**
 * 캐시에 데이터 저장
 */
export function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`💾 캐시 저장: ${key}`);
}

/**
 * 재시도 로직이 있는 fetch 함수
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // 429 에러 (Rate Limit)인 경우 재시도
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : baseDelay * Math.pow(2, attempt); // Exponential backoff
        
        console.log(`⚠️ Rate limit (429), ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // 마지막 시도가 아니면 재시도
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⚠️ 요청 실패, ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries');
}

/**
 * JWT 생성 및 Access Token 획득
 */
async function getAccessToken(serviceAccount: ServiceAccountKey): Promise<string> {
  try {
    // JWT Header
    const header = {
      alg: "RS256",
      typ: "JWT"
    }

    // JWT Payload
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    }

    // Base64url 인코딩
    const base64url = (obj: any) => {
      const str = JSON.stringify(obj)
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    }

    const headerEncoded = base64url(header)
    const payloadEncoded = base64url(payload)
    const signatureInput = `${headerEncoded}.${payloadEncoded}`
    
    // Private Key를 이용한 서명
    let privateKey = serviceAccount.private_key
    
    // private_key가 실제 줄바꿈 문자를 포함하고 있다면 \\n으로 변환
    if (privateKey.includes('\n') && !privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\n/g, '\\n')
    }
    
    // \\n을 실제 줄바꿈으로 변환
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    if (!privateKey || !privateKey.includes("BEGIN PRIVATE KEY")) {
      throw new Error("Invalid private key format. 키가 '-----BEGIN PRIVATE KEY-----'로 시작하는지 확인하세요.")
    }
    
    // PKCS#8 형식의 키를 import
    const pemHeader = "-----BEGIN PRIVATE KEY-----"
    const pemFooter = "-----END PRIVATE KEY-----"
    
    let pemContents: string
    try {
      // private key에서 헤더와 푸터 제거, 공백 제거
      const startIndex = privateKey.indexOf(pemHeader) + pemHeader.length
      const endIndex = privateKey.indexOf(pemFooter)
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("PEM 헤더나 푸터를 찾을 수 없습니다.")
      }
      
      pemContents = privateKey
        .substring(startIndex, endIndex)
        .replace(/\s/g, '') // 모든 공백, 탭, 줄바꿈 제거
        
      // Base64 문자만 포함되어 있는지 확인
      const base64Regex = /^[A-Za-z0-9+/=]+$/
      if (!base64Regex.test(pemContents)) {
        // 잘못된 문자 찾기
        const invalidChars = pemContents.split('').filter(c => !base64Regex.test(c))
        throw new Error(`Base64가 아닌 문자가 포함됨: ${[...new Set(invalidChars)].join(', ')}`)
      }
    } catch (e) {
      throw new Error(`Private key 추출 실패: ${e}`)
    }
    
    // Base64 디코딩
    let binaryDer: Uint8Array
    try {
      binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))
    } catch (e) {
      throw new Error(`Failed to decode base64 private key: ${e}. PEM 내용 길이: ${pemContents.length}`)
    }
    
    // CryptoKey 생성
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    )
    
    // 서명 생성
    const signatureBuffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signatureInput)
    )

    // Base64url 인코딩
    const signatureArray = Array.from(new Uint8Array(signatureBuffer))
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const jwt = `${signatureInput}.${signatureBase64}`
    
    // Access Token 요청
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`Access Token 획득 실패 (${tokenResponse.status}): ${error}`)
    }

    const tokenData = await tokenResponse.json()
    return tokenData.access_token
  } catch (error) {
    console.error("❌ getAccessToken 실패:", error)
    throw error
  }
}

/**
 * 스프레드시트 메타데이터 가져오기 (시트 이름 확인용)
 */
export async function getSpreadsheetMetadata(
  spreadsheetId: string
): Promise<any> {
  try {
    console.log("📋 스프레드시트 메타데이터 요청 중...")
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.")
    }

    const serviceAccount: ServiceAccountKey = JSON.parse(serviceAccountJson)
    const accessToken = await getAccessToken(serviceAccount)

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Google Sheets API 오류 (${response.status}): ${error}`)
    }

    const data = await response.json()
    console.log("✅ 메타데이터 로드 성공!")
    console.log("📊 사용 가능한 시트:")
    data.sheets?.forEach((sheet: any) => {
      console.log(`  - "${sheet.properties.title}" (ID: ${sheet.properties.sheetId})`)
    })
    
    return data
  } catch (error) {
    console.error("❌ 메타데이터 로드 실패:", error)
    throw error
  }
}

/**
 * 여러 범위의 데이터를 한 번에 가져오기
 */
export async function fetchMultipleRanges(
  spreadsheetId: string,
  ranges: string[]
): Promise<Record<string, any[][]>> {
  try {
    console.log("🔑 Service Account 키 파싱 시작...")
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.")
    }

    const serviceAccount: ServiceAccountKey = JSON.parse(serviceAccountJson)
    console.log("✅ Service Account 파싱 완료:", serviceAccount.client_email)
    
    console.log("🔐 Access Token 요청 중...")
    const accessToken = await getAccessToken(serviceAccount)
    console.log("✅ Access Token 획득 완료!")

    // Batch get values
    const rangeParams = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&')
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangeParams}`
    
    console.log("📡 Google Sheets API 호출 중...")
    
    // AbortController로 타임아웃 적용 (40초로 증가)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 40000)
    
    try {
      const response = await fetchWithRetry(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log("📥 API 응답 상태:", response.status)

      if (!response.ok) {
        const error = await response.text()
        console.error("❌ API 오류 응답:", error)
        throw new Error(`Google Sheets API 오류 (${response.status}): ${error}`)
      }

      const data = await response.json()
      const result: Record<string, any[][]> = {}
      
      data.valueRanges.forEach((vr: any, index: number) => {
        result[ranges[index]] = vr.values || []
      })

      console.log("✅ 데이터 파싱 완료!")
      return result
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error("Google Sheets API 타임아웃 (40초 초과)")
      }
      throw fetchError
    }
  } catch (error) {
    console.error("❌ fetchMultipleRanges 오류 상세:")
    console.error("  - 에러:", error)
    throw error
  }
}

/**
 * 단일 범위의 데이터를 가볍게 가져오기 (업데이트 체크용)
 */
export async function fetchSingleRange(
  spreadsheetId: string,
  range: string
): Promise<any[][]> {
  try {
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.")
    }

    const serviceAccount: ServiceAccountKey = JSON.parse(serviceAccountJson)
    const accessToken = await getAccessToken(serviceAccount)

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Google Sheets API 오류 (${response.status}): ${error}`)
    }

    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error("❌ fetchSingleRange 오류:", error)
    throw error
  }
}