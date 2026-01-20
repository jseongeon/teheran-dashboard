/**
 * Supabase DB에 데이터 동기화
 */

import { createClient } from "npm:@supabase/supabase-js@2";

// ========================================
// 📌 타입 정의
// ========================================
export interface InquiryRow {
  date: string;
  time: string;
  receiptType: string;
  detailSource: string;
  field: string;
  customerName: string;
  phone: string;
  email: string;
  receptionist: string;
  content: string;
  attachedFile: string;
  isReminder: boolean;
  attorney: string;
  responseContent: string;
  isVisit: boolean;
  isContract: boolean;
  contractDate: string;
  contractAmount: number | null;
  isExcluded: boolean;
  isDuplicate: boolean;
  originalRowNumber: number;
}

// ========================================
// 📌 데이터 변환 함수
// ========================================

/**
 * 스프레드시트 원본 데이터를 DB 형식으로 변환
 */
export function transformSheetRowToInquiry(row: any[], rowIndex: number): InquiryRow | null {
  const date = row[1] || ""; // B열: 날짜
  const time = row[2] || ""; // C열: 문의시간
  const receiptType = row[3] || ""; // D열: 접수유형
  const detailSource = row[4] || ""; // E열: 세부매체
  const field = row[5] || ""; // F열: 세부분야
  const customerName = row[6] || ""; // G열: 고객성함
  const phone = row[7] || ""; // H열: 고객연락처
  const email = row[8] || ""; // I열: 고객이메일
  const receptionist = row[9] || ""; // J열: 1차접수자
  const content = row[10] || ""; // K열: 접수내용
  const attachedFile = row[11] || ""; // L열: 첨부파일
  const isReminder = row[12] === true || row[12] === "TRUE"; // M열: 리마인드CRM
  const attorney = row[13] || ""; // N열: 변리사님
  const responseContent = row[14] || ""; // O열: 상담내용
  const isVisit = row[15] === true || row[15] === "TRUE"; // P열: 방문/출장
  const isContract = row[16] === true || row[16] === "TRUE"; // Q열: 수임여부
  const contractDate = row[16] || ""; // R열: 수임일
  const contractAmount = row[17] ? parseFloat(String(row[17]).replace(/[^0-9.-]/g, "")) : null; // S열: 수임금액

  // 날짜가 없으면 무효 데이터 (날짜는 필수)
  if (!date) return null;

  const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"];
  const isExcluded = receiptType === "문의건X" && excludeDetailSources.includes(detailSource);

  // 중복 체크는 나중에 배치로 처리 (같은 달 내 핸드폰 중복)
  const isDuplicate = false;

  return {
    date,
    time,
    receiptType,
    detailSource,
    field,
    customerName,
    phone,
    email,
    receptionist,
    content,
    attachedFile,
    isReminder,
    attorney,
    responseContent,
    isVisit,
    isContract,
    contractDate,
    contractAmount,
    isExcluded,
    isDuplicate,
    originalRowNumber: rowIndex, // 호출 시 이미 정확한 행 번호 전달받음
  };
}

/**
 * 중복 문의 체크 (같은 달 내 핸드폰 번호 중복)
 */
export function markDuplicateInquiries(inquiries: InquiryRow[]): InquiryRow[] {
  // 월별 + 핸드폰 번호로 그룹화
  const monthPhoneMap = new Map<string, InquiryRow[]>();

  inquiries.forEach((inquiry) => {
    // "연락처중복" 또는 "리마인드CRM" 세부출처만 체크
    const isDuplicateCheckTarget =
      inquiry.receiptType === "문의건X" &&
      (inquiry.detailSource === "연락처중복" || inquiry.detailSource === "리마인드CRM");

    if (!isDuplicateCheckTarget) return;
    if (!inquiry.phone) return;

    const month = inquiry.date.substring(0, 7); // YYYY-MM
    const key = `${month}-${inquiry.phone}`;

    if (!monthPhoneMap.has(key)) {
      monthPhoneMap.set(key, []);
    }
    monthPhoneMap.get(key)!.push(inquiry);
  });

  // 중복 마킹: 같은 월-핸드폰 그룹 내에서 첫 번째만 유효, 나머지는 중복
  monthPhoneMap.forEach((group) => {
    if (group.length > 1) {
      // 첫 번째는 유효, 나머지는 중복으로 마킹
      for (let i = 1; i < group.length; i++) {
        group[i].isDuplicate = true;
      }
    }
  });

  return inquiries;
}

// ========================================
// 📌 데이터베이스 동기화 함수
// ========================================

export async function syncToDatabase(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  inquiries: InquiryRow[]
): Promise<{ success: boolean; message: string; stats: any }> {
  // URL 유효성 검증 추가
  console.log(`🔍 syncToDatabase 호출됨:`);
  console.log(`  - URL: ${supabaseUrl || '(undefined)'}`);
  console.log(`  - URL 타입: ${typeof supabaseUrl}`);
  console.log(`  - URL 길이: ${supabaseUrl?.length || 0}`);
  console.log(`  - Key 있음: ${!!supabaseServiceRoleKey}`);

  if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    throw new Error(`Invalid supabaseUrl: "${supabaseUrl}" (type: ${typeof supabaseUrl})`);
  }

  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Received: "${supabaseUrl}"`);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  console.log(`📊 동기화 시작: ${inquiries.length}건`);

  const stats = {
    total: inquiries.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    // 1. 기존 데이터 확인 (원본 행 번호로 매칭)
    const { data: existingData, error: fetchError } = await supabase
      .from("inquiries")
      .select("original_row_number, id");

    if (fetchError) {
      throw new Error(`기존 데이터 조회 실패: ${fetchError.message}`);
    }

    const existingRowNumbers = new Set(
      existingData?.map((row) => row.original_row_number) || []
    );

    // 2. 신규/업데이트 데이터 분리
    const toInsert: any[] = [];
    const toUpdate: any[] = [];

    inquiries.forEach((inquiry) => {
      const dbRecord = {
        date: inquiry.date,
        time: inquiry.time,
        receipt_type: inquiry.receiptType,
        detail_source: inquiry.detailSource,
        field: inquiry.field,
        customer_name: inquiry.customerName,
        phone: inquiry.phone,
        email: inquiry.email,
        receptionist: inquiry.receptionist,
        content: inquiry.content,
        attached_file: inquiry.attachedFile,
        is_reminder: inquiry.isReminder,
        attorney: inquiry.attorney,
        response_content: inquiry.responseContent,
        is_visit: inquiry.isVisit,
        is_contract: inquiry.isContract,
        contract_date: inquiry.contractDate,
        contract_amount: inquiry.contractAmount,
        is_excluded: inquiry.isExcluded,
        is_duplicate: inquiry.isDuplicate,
        original_row_number: inquiry.originalRowNumber,
        synced_at: new Date().toISOString(),
      };

      if (existingRowNumbers.has(inquiry.originalRowNumber)) {
        toUpdate.push(dbRecord);
      } else {
        toInsert.push(dbRecord);
      }
    });

    // 3. 삽입
    if (toInsert.length > 0) {
      console.log(`➕ 신규 삽입: ${toInsert.length}건`);
      const { error: insertError } = await supabase.from("inquiries").insert(toInsert);

      if (insertError) {
        console.error("삽입 오류:", insertError);
        stats.errors += toInsert.length;
      } else {
        stats.inserted = toInsert.length;
      }
    }

    // 4. 업데이트 (배치 처리)
    if (toUpdate.length > 0) {
      console.log(`🔄 업데이트: ${toUpdate.length}건`);
      
      for (const record of toUpdate) {
        const { error: updateError } = await supabase
          .from("inquiries")
          .update(record)
          .eq("original_row_number", record.original_row_number);

        if (updateError) {
          console.error(`업데이트 오류 (행 ${record.original_row_number}):`, updateError);
          stats.errors++;
        } else {
          stats.updated++;
        }
      }
    }

    // 5. 수임 테이블 동기화 (is_contract가 true인 것만)
    const contracts = inquiries.filter(
      (inquiry) => inquiry.isContract && !inquiry.isExcluded
    );

    if (contracts.length > 0) {
      console.log(`📝 수임 데이터 동기화: ${contracts.length}건`);

      // 기존 수임 데이터 확인
      const { data: existingContracts } = await supabase
        .from("contracts")
        .select("original_row_number");

      const existingContractRows = new Set(
        existingContracts?.map((c) => c.original_row_number) || []
      );

      const contractsToInsert = contracts
        .filter((c) => !existingContractRows.has(c.originalRowNumber))
        .map((c) => ({
          date: c.date,
          time: c.time,
          receipt_type: c.receiptType,
          detail_source: c.detailSource,
          field: c.field,
          customer_name: c.customerName,
          phone: c.phone,
          email: c.email,
          attorney: c.attorney,
          contract_date: c.contractDate,
          contract_amount: c.contractAmount,
          content: c.content,
          response_content: c.responseContent,
          original_row_number: c.originalRowNumber,
          synced_at: new Date().toISOString(),
        }));

      if (contractsToInsert.length > 0) {
        const { error: contractInsertError } = await supabase
          .from("contracts")
          .insert(contractsToInsert);

        if (contractInsertError) {
          console.error("수임 데이터 삽입 오류:", contractInsertError);
        }
      }
    }

    // 6. 동기화 로그 저장
    await supabase.from("sync_logs").insert({
      sync_type: "full",
      records_processed: stats.total,
      records_inserted: stats.inserted,
      records_updated: stats.updated,
      records_skipped: stats.skipped,
      status: stats.errors > 0 ? "partial" : "success",
      completed_at: new Date().toISOString(),
    });

    console.log("✅ 동기화 완료:", stats);

    return {
      success: true,
      message: "동기화 완료",
      stats,
    };
  } catch (error) {
    console.error("❌ 동기화 실패:", error);

    // 에러 로그 저장
    await supabase.from("sync_logs").insert({
      sync_type: "full",
      records_processed: stats.total,
      records_inserted: stats.inserted,
      records_updated: stats.updated,
      records_skipped: stats.skipped,
      error_message: error instanceof Error ? error.message : String(error),
      status: "failed",
      completed_at: new Date().toISOString(),
    });

    return {
      success: false,
      message: error instanceof Error ? error.message : "알 수 없는 오류",
      stats,
    };
  }
}