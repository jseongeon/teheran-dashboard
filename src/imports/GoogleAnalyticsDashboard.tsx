import svgPaths from "./svg-asq7m4afdo";

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-[221.813px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-start relative w-[221.813px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-neutral-50 text-nowrap whitespace-pre">Analytics Dashboard</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[36px]">
        <Icon />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14890d00} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[36px] items-center justify-center relative w-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[36px] relative shrink-0 w-[80px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center relative w-[80px]">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-neutral-950 h-[64px] relative shrink-0 w-[1339.33px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-neutral-800 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[64px] items-center justify-between pb-[0.667px] pt-0 px-[24px] relative w-[1339.33px]">
        <Heading />
        <Container />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold','Noto_Sans_KR:Bold',sans-serif] leading-[24px] left-0 text-[16px] text-green-100 text-nowrap top-[-1.67px] whitespace-pre" style={{ fontVariationSettings: "'wght' 700" }}>
        ✅ 서버 연결 성공!
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#b9f8cf] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">📊 SPREADSHEET_ID: ✅ 설정됨</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#b9f8cf] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">🔑 GOOGLE_SERVICE_ACCOUNT_KEY: ✅ 설정됨</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#b9f8cf] text-[14px] top-[-1.33px] w-[192px]">⏰ 2025-12-05T06:02:09.100Z</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[68px] items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}

function ServerStatusBanner() {
  return (
    <div className="bg-[rgba(13,84,43,0.2)] h-[120.667px] relative shrink-0 w-[1339.33px]" data-name="ServerStatusBanner">
      <div aria-hidden="true" className="absolute border-[#016630] border-[0px_0px_0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[120.667px] items-start pb-[0.667px] pt-[12px] px-[16px] relative w-[1339.33px]">
        <Paragraph />
        <Container4 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[28px] left-0 not-italic text-[18px] text-neutral-50 text-nowrap top-[-1px] whitespace-pre">보고서</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p10842600} id="Vector" stroke="var(--stroke-0, #8EC5FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pb1da4c2} id="Vector_2" stroke="var(--stroke-0, #8EC5FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[195.33px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8.00001L6 4.00001" id="Vector" stroke="var(--stroke-0, #8EC5FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#162456] h-[36px] left-0 rounded-[8px] top-0 w-[223.333px]" data-name="Button">
      <Icon2 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[43.5px] not-italic text-[#8ec5ff] text-[14px] text-center text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">홈</p>
      <Icon3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[40px] w-[223.333px]" data-name="Button">
      <Icon4 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[57.5px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">실시간</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3b6ee540} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[195.33px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[80px] w-[223.333px]" data-name="Button">
      <Icon5 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[50px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">문의</p>
      <Icon6 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_227_2113)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p245eb100} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_227_2113">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[195.33px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[120px] w-[223.333px]" data-name="Button">
      <Icon7 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[50px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">수임</p>
      <Icon8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[195.33px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[160px] w-[223.333px]" data-name="Button">
      <Icon9 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[64px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">추가지표</p>
      <Icon10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_227_2033)" id="Icon">
          <path d={svgPaths.pa0aae00} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e50f300} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_227_2033">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[195.33px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[200px] w-[223.333px]" data-name="Button">
      <Icon11 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[64px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">세부지표</p>
      <Icon12 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pe98ba80} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1550e4e0} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p592ad00} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28a75800} id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_5" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[240px] w-[223.333px]" data-name="Button">
      <Icon13 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[87.5px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[6.67px] translate-x-[-50%] whitespace-pre">세부매체 데이터</p>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[276px] relative shrink-0 w-full" data-name="Navigation">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[352px] relative shrink-0 w-[255.333px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[16px] h-[352px] items-start pb-0 pt-[16px] px-[16px] relative w-[255.333px]">
        <Heading1 />
        <Navigation />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-neutral-950 h-[1120.67px] relative shrink-0 w-[256px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[0px_0.667px_0px_0px] border-neutral-800 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[1120.67px] items-start pl-0 pr-[0.667px] py-0 relative w-[256px]">
        <Container5 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arial:Bold','Noto_Sans_KR:Bold',sans-serif] leading-[36px] left-0 text-[30px] text-neutral-50 text-nowrap top-[-3px] tracking-[-0.75px] whitespace-pre" style={{ fontVariationSettings: "'wght' 700" }}>
        대시보드
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#a1a1a1] text-[16px] text-nowrap top-[-1.67px] whitespace-pre">법무 업무 성과와 현황을 분석해보세요</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[60px] relative shrink-0 w-[278.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[60px] items-start relative w-[278.5px]">
        <Heading2 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[10.67px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[32px] relative rounded-[8px] shrink-0 w-[80.76px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[80.76px]">
        <Icon14 />
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[56.17px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[4.67px] translate-x-[-50%] whitespace-pre">12월</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[10.67px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12824f00} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[32px] relative rounded-[8px] shrink-0 w-[79.333px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[79.333px]">
        <Icon15 />
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[54.67px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[4.67px] translate-x-[-50%] whitespace-pre">필터</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[10.67px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 10V2" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p23ad1400} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[32px] relative rounded-[8px] shrink-0 w-[107.333px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[107.333px]">
        <Icon16 />
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[68.67px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[4.67px] translate-x-[-50%] whitespace-pre">내보내기</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[32px] relative shrink-0 w-[291.427px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[32px] items-center relative w-[291.427px]">
        <Button9 />
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex h-[60px] items-center justify-between left-[24px] top-[24px] w-[1020px]" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[42px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">문의건</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3b6ee540} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[52px] relative shrink-0 w-[241.667px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative w-[241.667px]">
        <CardTitle />
        <Icon17 />
      </div>
    </div>
  );
}

function MetricCard() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="MetricCard">
      <p className="basis-0 font-['Arial:Bold',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-neutral-50">194</p>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[9.302px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d={svgPaths.p1bc11a80} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.775174" />
          <path d={svgPaths.p263fa80} id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.775174" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[123.344px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[123.344px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#fb2c36] text-[12px] top-[-1px] w-[124px]">-67.88079470198676%</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[53.021px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[53.021px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#a1a1a1] text-[12px] top-[-1px] w-[41px]">지난 월 대비</p>
      </div>
    </div>
  );
}

function MetricCard1() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0 w-full" data-name="MetricCard">
      <Icon18 />
      <Text />
      <Text1 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="h-[92px] relative shrink-0 w-[241.667px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[92px] items-start px-[24px] py-0 relative w-[241.667px]">
        <MetricCard />
        <MetricCard1 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="[grid-area:1_/_1] bg-neutral-950 h-[169.333px] justify-self-stretch relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[169.333px] items-start p-[0.667px] relative w-full">
          <CardHeader />
          <CardContent />
        </div>
      </div>
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[42px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">수임건</p>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="h-[52px] relative shrink-0 w-[241.667px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative w-[241.667px]">
        <CardTitle1 />
        <Icon19 />
      </div>
    </div>
  );
}

function MetricCard2() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="MetricCard">
      <p className="basis-0 font-['Arial:Bold',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-neutral-50">0</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[16.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[16.656px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#a1a1a1] text-[12px] top-[-1px] w-[17px]">0%</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[68.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[68.438px]">
        <p className="basis-0 font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#a1a1a1] text-[12px]">지난 월 대비</p>
      </div>
    </div>
  );
}

function MetricCard3() {
  return (
    <div className="content-stretch flex gap-[4px] h-[16px] items-center relative shrink-0 w-full" data-name="MetricCard">
      <Text2 />
      <Text3 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="h-[76px] relative shrink-0 w-[241.667px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[76px] items-start px-[24px] py-0 relative w-[241.667px]">
        <MetricCard2 />
        <MetricCard3 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="[grid-area:1_/_2] bg-neutral-950 h-[169.333px] justify-self-stretch relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[169.333px] items-start p-[0.667px] relative w-full">
          <CardHeader1 />
          <CardContent1 />
        </div>
      </div>
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[126.771px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[126.771px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">전월 대비 문의 추이</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="h-[52px] relative shrink-0 w-[241.667px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative w-[241.667px]">
        <CardTitle2 />
        <Icon20 />
      </div>
    </div>
  );
}

function MetricCard4() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="MetricCard">
      <p className="basis-0 font-['Arial:Bold',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-neutral-50">-67.9%</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[9.302px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d={svgPaths.p1bc11a80} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.775174" />
          <path d={svgPaths.p263fa80} id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.775174" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[123.344px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[123.344px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#fb2c36] text-[12px] top-[-1px] w-[124px]">-67.88079470198676%</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[32px] relative shrink-0 w-[53.021px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[53.021px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#a1a1a1] text-[12px] top-[-1px] w-[41px]">지난 월 대비</p>
      </div>
    </div>
  );
}

function MetricCard5() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0 w-full" data-name="MetricCard">
      <Icon21 />
      <Text4 />
      <Text5 />
    </div>
  );
}

function CardContent2() {
  return (
    <div className="h-[92px] relative shrink-0 w-[241.667px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[92px] items-start px-[24px] py-0 relative w-[241.667px]">
        <MetricCard4 />
        <MetricCard5 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="[grid-area:1_/_3] bg-neutral-950 h-[169.333px] justify-self-stretch relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[169.333px] items-start p-[0.667px] relative w-full">
          <CardHeader2 />
          <CardContent2 />
        </div>
      </div>
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[140.771px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[140.771px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">전월 대비 수임율 추이</p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_227_2125)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_227_2125">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="h-[52px] relative shrink-0 w-[241.667px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative w-[241.667px]">
        <CardTitle3 />
        <Icon22 />
      </div>
    </div>
  );
}

function MetricCard6() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="MetricCard">
      <p className="basis-0 font-['Arial:Bold',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-neutral-50">0.0%</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[16.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[16.656px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#a1a1a1] text-[12px] top-[-1px] w-[17px]">0%</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[16px] relative shrink-0 w-[68.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[68.438px]">
        <p className="basis-0 font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#a1a1a1] text-[12px]">지난 월 대비</p>
      </div>
    </div>
  );
}

function MetricCard7() {
  return (
    <div className="content-stretch flex gap-[4px] h-[16px] items-center relative shrink-0 w-full" data-name="MetricCard">
      <Text6 />
      <Text7 />
    </div>
  );
}

function CardContent3() {
  return (
    <div className="h-[76px] relative shrink-0 w-[241.667px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[76px] items-start px-[24px] py-0 relative w-[241.667px]">
        <MetricCard6 />
        <MetricCard7 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="[grid-area:1_/_4] bg-neutral-950 h-[169.333px] justify-self-stretch relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[169.333px] items-start p-[0.667px] relative w-full">
          <CardHeader3 />
          <CardContent3 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute gap-[16px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[169.333px] left-[24px] top-[108px] w-[1020px]" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-0 size-[16px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_227_2065)" id="Icon">
          <path d={svgPaths.p2d09d900} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_227_2065">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="absolute h-[16px] left-[24px] top-[24px] w-[970.667px]" data-name="CardTitle">
      <Icon23 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-[24px] not-italic text-[16px] text-neutral-50 text-nowrap top-[-1.67px] whitespace-pre">실시간</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[46px] w-[970.667px]" data-name="CardDescription">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#a1a1a1] text-[16px] top-[-1.67px] w-[166px]">2025년 12월 활동 현황</p>
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[1018.67px]" data-name="CardHeader">
      <CardTitle4 />
      <CardDescription />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-[138.19px] not-italic text-[#00c950] text-[30px] text-center text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">109</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[137.81px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[-1.33px] translate-x-[-50%] whitespace-pre">현재 사용자</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[92px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] h-[92px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-[138.07px] not-italic text-[30px] text-center text-neutral-50 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">1,216</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[137.81px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[-1.33px] translate-x-[-50%] whitespace-pre">이번달 페이지뷰</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[92px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] h-[92px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container13 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-[138.19px] not-italic text-[30px] text-center text-neutral-50 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">857</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[137.81px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[-1.33px] translate-x-[-50%] whitespace-pre">이번달 세션</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[92px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] h-[92px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container16 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[308px] items-start left-0 top-0 w-[307.552px]" data-name="Container">
      <Container12 />
      <Container15 />
      <Container18 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_227_2021)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_227_2021">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 4">
      <Icon24 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[24px] not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">인기 매체</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-0.33px] whitespace-pre">/</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">23</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-0 w-[307.552px]" data-name="Container">
      <Text8 />
      <Badge />
    </div>
  );
}

function Text9() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-0.33px] whitespace-pre">/products</p>
      </div>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">19</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[45.33px] w-[307.552px]" data-name="Container">
      <Text9 />
      <Badge1 />
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-0.33px] whitespace-pre">/blog/latest-post</p>
      </div>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">17</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[90.67px] w-[307.552px]" data-name="Container">
      <Text10 />
      <Badge2 />
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-0.33px] whitespace-pre">/about</p>
      </div>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[23.948px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[23.948px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">9</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[136px] w-[307.552px]" data-name="Container">
      <Text11 />
      <Badge3 />
    </div>
  );
}

function Text12() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-0.33px] whitespace-pre">/contact</p>
      </div>
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[23.948px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[23.948px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">8</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[181.33px] w-[307.552px]" data-name="Container">
      <Text12 />
      <Badge4 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[218.667px] relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container21 />
      <Container22 />
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[308px] items-start left-[331.55px] top-0 w-[307.552px]" data-name="Container">
      <Heading3 />
      <Container25 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3b6ee540} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 4">
      <Icon25 />
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[24px] not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">변리사님</p>
    </div>
  );
}

function Text13() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">윤웅채 변리사님</p>
      </div>
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">49</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-0 w-[307.563px]" data-name="Container">
      <Text13 />
      <Badge5 />
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">김신연 변리사님</p>
      </div>
    </div>
  );
}

function Badge6() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">20</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[45.33px] w-[307.563px]" data-name="Container">
      <Text14 />
      <Badge6 />
    </div>
  );
}

function Text15() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">이상담 변리사님</p>
      </div>
    </div>
  );
}

function Badge7() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">17</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[90.67px] w-[307.563px]" data-name="Container">
      <Text15 />
      <Badge7 />
    </div>
  );
}

function Text16() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">김봉근 변리사님</p>
      </div>
    </div>
  );
}

function Badge8() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[30.552px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[30.552px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">11</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[136px] w-[307.563px]" data-name="Container">
      <Text16 />
      <Badge8 />
    </div>
  );
}

function Text17() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] overflow-clip relative rounded-[inherit] w-full">
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">기타</p>
      </div>
    </div>
  );
}

function Badge9() {
  return (
    <div className="bg-neutral-800 h-[21.333px] relative rounded-[8px] shrink-0 w-[23.948px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.333px] items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[inherit] w-[23.948px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">5</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute box-border content-stretch flex h-[37.333px] items-center justify-between left-0 px-[8px] py-0 rounded-[4px] top-[181.33px] w-[307.563px]" data-name="Container">
      <Text17 />
      <Badge9 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[218.667px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container28 />
      <Container29 />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[308px] items-start left-[663.1px] top-0 w-[307.563px]" data-name="Container">
      <Heading4 />
      <Container32 />
    </div>
  );
}

function RealtimeWidget() {
  return (
    <div className="absolute h-[308px] left-[24px] top-[94px] w-[970.667px]" data-name="RealtimeWidget">
      <Container19 />
      <Container26 />
      <Container33 />
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-neutral-950 border-[0.667px] border-neutral-800 border-solid h-[427.333px] left-[24px] rounded-[14px] top-[301.33px] w-[1020px]" data-name="Card">
      <CardHeader4 />
      <RealtimeWidget />
    </div>
  );
}

function CardTitle5() {
  return (
    <div className="absolute h-[16px] left-[24px] top-[24px] w-[625.333px]" data-name="CardTitle">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-50 text-nowrap top-[-1.67px] whitespace-pre">트래픽 개요</p>
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[46px] w-[625.333px]" data-name="CardDescription">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#a1a1a1] text-[16px] text-nowrap top-[-1.67px] whitespace-pre">최근 10개월간의 문의건, 수임건, 수임율 추이</p>
    </div>
  );
}

function CardHeader5() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[673.333px]" data-name="CardHeader">
      <CardTitle5 />
      <CardDescription1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[1.43%_0.78%_10%_10.14%]" data-name="Group">
      <div className="absolute bottom-[-0.16%] left-0 right-0 top-[-0.16%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 571 311">
          <g id="Group">
            <path d="M0 310.5H571" id="Vector" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 233H571" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 155.5H571" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 78H571" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 0.5H571" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[1.43%_0.78%_10%_10.14%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.09%] right-[-0.09%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 572 310">
          <g id="Group">
            <path d="M0.5 0V310" id="Vector" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M63.9444 0V310" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M127.389 0V310" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M190.833 0V310" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M254.278 0V310" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M317.722 0V310" id="Vector_6" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M381.167 0V310" id="Vector_7" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M444.611 0V310" id="Vector_8" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M508.056 0V310" id="Vector_9" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M571.5 0V310" id="Vector_10" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[1.43%_0.78%_10%_10.14%]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[91.29%_88.38%_4.42%_8.66%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_88.38%_4.42%_8.66%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">3월</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[91.29%_78.48%_4.42%_18.56%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_78.48%_4.42%_18.56%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">4월</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[91.29%_68.58%_4.42%_28.45%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_68.58%_4.42%_28.45%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">5월</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[91.29%_58.68%_4.42%_38.35%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_58.68%_4.42%_38.35%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">6월</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[91.29%_48.86%_4.42%_48.33%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_48.86%_4.42%_48.33%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">7월</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[91.29%_38.89%_4.42%_58.15%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_38.89%_4.42%_58.15%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">8월</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[91.29%_28.99%_4.42%_68.04%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_28.99%_4.42%_68.04%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">9월</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[91.29%_18.63%_4.42%_77.47%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_18.63%_4.42%_77.47%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">10월</p>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[91.29%_8.88%_4.42%_87.53%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_8.88%_4.42%_87.53%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">11월</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[91.29%_0.1%_4.42%_96.16%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[91.29%_0.1%_4.42%_96.16%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">12월</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[91.29%_0.1%_4.42%_8.66%]" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[91.29%_0.1%_4.42%_8.66%]" data-name="Group">
      <Group13 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[87.79%_91.11%_7.93%_7.64%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.79%_91.11%_7.93%_7.64%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">0</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[65.65%_91.11%_30.07%_6.55%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[65.65%_91.11%_30.07%_6.55%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">45</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[43.5%_91.11%_52.21%_6.55%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[43.5%_91.11%_52.21%_6.55%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">90</p>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[21.36%_91.11%_74.35%_5.62%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[21.36%_91.11%_74.35%_5.62%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">135</p>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[0.36%_91.11%_95.35%_5.62%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[0.36%_91.11%_95.35%_5.62%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">180</p>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[0.36%_91.11%_7.93%_5.62%]" data-name="Group">
      <Group15 />
      <Group16 />
      <Group17 />
      <Group18 />
      <Group19 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[0.36%_91.11%_7.93%_5.62%]" data-name="Group">
      <Group20 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[5.21%_0.16%_57.57%_9.52%]" data-name="Group">
      <div className="absolute inset-[-1.15%_-0.26%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 582 134">
          <g id="Group">
            <path d={svgPaths.p3e5ece00} id="Vector" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
            <g id="Group_2">
              <path d={svgPaths.p315c5e00} fill="var(--fill-0, #FF5722)" id="Vector_2" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p39975000} fill="var(--fill-0, #FF5722)" id="Vector_3" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p17d3a800} fill="var(--fill-0, #FF5722)" id="Vector_4" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p2c5eda80} fill="var(--fill-0, #FF5722)" id="Vector_5" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p25cd9d00} fill="var(--fill-0, #FF5722)" id="Vector_6" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p79b4900} fill="var(--fill-0, #FF5722)" id="Vector_7" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p2be44400} fill="var(--fill-0, #FF5722)" id="Vector_8" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p3eba7400} fill="var(--fill-0, #FF5722)" id="Vector_9" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p37e1ea00} fill="var(--fill-0, #FF5722)" id="Vector_10" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
              <path d={svgPaths.p2707aff2} fill="var(--fill-0, #FF5722)" id="Vector_11" stroke="var(--stroke-0, #FF5722)" strokeWidth="3" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute inset-[24.4%_0.16%_40.84%_9.52%]" data-name="Group">
      <div className="absolute inset-[-1.23%_-0.26%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 582 125">
          <g id="Group">
            <path d={svgPaths.p16c331c0} id="Vector" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
            <g id="Group_2">
              <path d={svgPaths.p2a3b3a40} fill="var(--fill-0, #4CAF50)" id="Vector_2" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p1fa81eb0} fill="var(--fill-0, #4CAF50)" id="Vector_3" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p17d3a800} fill="var(--fill-0, #4CAF50)" id="Vector_4" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p3930f9f0} fill="var(--fill-0, #4CAF50)" id="Vector_5" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p3733eb00} fill="var(--fill-0, #4CAF50)" id="Vector_6" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p2e80d500} fill="var(--fill-0, #4CAF50)" id="Vector_7" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p198c5600} fill="var(--fill-0, #4CAF50)" id="Vector_8" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p770c400} fill="var(--fill-0, #4CAF50)" id="Vector_9" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p2c3fb800} fill="var(--fill-0, #4CAF50)" id="Vector_10" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
              <path d={svgPaths.p34173be0} fill="var(--fill-0, #4CAF50)" id="Vector_11" stroke="var(--stroke-0, #4CAF50)" strokeWidth="3" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute inset-[50.67%_0.16%_40.84%_9.52%]" data-name="Group">
      <div className="absolute inset-[-5.05%_-0.26%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 582 33">
          <g id="Group">
            <path d={svgPaths.p2619fb00} id="Vector" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
            <g id="Group_2">
              <path d={svgPaths.p3eaea170} fill="var(--fill-0, #2196F3)" id="Vector_2" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p23242c80} fill="var(--fill-0, #2196F3)" id="Vector_3" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p18c4c110} fill="var(--fill-0, #2196F3)" id="Vector_4" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p16d0f980} fill="var(--fill-0, #2196F3)" id="Vector_5" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p391e5c80} fill="var(--fill-0, #2196F3)" id="Vector_6" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p176ae500} fill="var(--fill-0, #2196F3)" id="Vector_7" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p2f004a80} fill="var(--fill-0, #2196F3)" id="Vector_8" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p321f33f0} fill="var(--fill-0, #2196F3)" id="Vector_9" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.p6057b00} fill="var(--fill-0, #2196F3)" id="Vector_10" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
              <path d={svgPaths.pa98c080} fill="var(--fill-0, #2196F3)" id="Vector_11" stroke="var(--stroke-0, #2196F3)" strokeWidth="3" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute h-[350px] left-0 overflow-clip top-0 w-[641px]" data-name="Icon">
      <Group2 />
      <Group14 />
      <Group21 />
      <Group22 />
      <Group23 />
      <Group24 />
    </div>
  );
}

function CardContent4() {
  return (
    <div className="absolute h-[350px] left-[8px] top-[94px] w-[641px]" data-name="CardContent">
      <Icon26 />
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-neutral-950 border-[0.667px] border-neutral-800 border-solid h-[469.333px] left-0 rounded-[14px] top-0 w-[674.667px]" data-name="Card">
      <CardHeader5 />
      <CardContent4 />
    </div>
  );
}

function CardTitle6() {
  return (
    <div className="[grid-area:1_/_1] place-self-stretch relative shrink-0" data-name="CardTitle">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-50 text-nowrap top-[-1.67px] whitespace-pre">접수유형별 트래픽</p>
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="[grid-area:2_/_1] place-self-stretch relative shrink-0" data-name="CardDescription">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#a1a1a1] text-[16px] text-nowrap top-[-1.67px] whitespace-pre">문의 접수 채널별 분포</p>
    </div>
  );
}

function CardHeader6() {
  return (
    <div className="absolute box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[minmax(0px,_16fr)_minmax(0px,_1fr)] h-[70px] left-0 pb-0 pt-[24px] px-[24px] top-0 w-[328px]" data-name="CardHeader">
      <CardTitle6 />
      <CardDescription2 />
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[8.67%_14.29%_58%_23.48%]" data-name="Group">
      <div className="absolute inset-[-0.5%_-0.29%_-0.5%_-0.41%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 176 101">
          <g id="Group">
            <path d={svgPaths.p26eb3900} fill="var(--fill-0, #FF5722)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute inset-[21.91%_59.14%_27.85%_14.29%]" data-name="Group">
      <div className="absolute inset-[-0.46%_-0.89%_-0.44%_-0.67%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 153">
          <g id="Group">
            <path d={svgPaths.p142f6900} fill="var(--fill-0, #9C27B0)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute inset-[58.9%_30.91%_24.67%_37.64%]" data-name="Group">
      <div className="absolute inset-[-1.4%_-0.78%_-1.01%_-0.73%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 51">
          <g id="Group">
            <path d={svgPaths.pba33d80} fill="var(--fill-0, #2196F3)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute inset-[50.9%_18.02%_31.49%_62.99%]" data-name="Group">
      <div className="absolute inset-[-1.27%_-1.26%_-1.33%_-1.32%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 55">
          <g id="Group">
            <path d={svgPaths.p1b63e5a0} fill="var(--fill-0, #FFC107)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute inset-[43.74%_14.42%_45.83%_69.95%]" data-name="Group">
      <div className="absolute inset-[-1.73%_-1.24%_-2.07%_-1.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 33">
          <g id="Group">
            <path d={svgPaths.p17148480} fill="var(--fill-0, #4CAF50)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents inset-[8.67%_14.29%_24.67%_14.29%]" data-name="Group">
      <Group25 />
      <Group26 />
      <Group27 />
      <Group28 />
      <Group29 />
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents inset-[8.67%_14.29%_24.67%_14.29%]" data-name="Group">
      <Group30 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute h-[300px] left-0 overflow-clip top-0 w-[280px]" data-name="Icon">
      <Group31 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-0 size-[14px] top-[7.56px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #FFC107)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute content-stretch flex h-[21.333px] items-start left-[18px] top-[1.33px] w-[32px]" data-name="Text">
      <p className="basis-0 font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#ffc107] text-[16px] text-center">기타</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="absolute h-[24px] left-[2.19px] top-0 w-[50px]" data-name="List Item">
      <Icon28 />
      <Text18 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-0 size-[14px] top-[7.56px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #4CAF50)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[21.333px] items-start left-[18px] top-[1.33px] w-[57.625px]" data-name="Text">
      <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#4caf50] text-[16px] text-center text-nowrap whitespace-pre">문의건X</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="absolute h-[24px] left-[62.19px] top-0 w-[75.625px]" data-name="List Item">
      <Icon29 />
      <Text19 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-0 size-[14px] top-[7.56px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #9C27B0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute content-stretch flex h-[21.333px] items-start left-[18px] top-[1.33px] w-[32px]" data-name="Text">
      <p className="basis-0 font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#9c27b0] text-[16px] text-center">유선</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="absolute h-[24px] left-[147.81px] top-0 w-[50px]" data-name="List Item">
      <Icon30 />
      <Text20 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-0 size-[14px] top-[7.56px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #2196F3)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute content-stretch flex h-[21.333px] items-start left-[18px] top-[1.33px] w-[32px]" data-name="Text">
      <p className="basis-0 font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#2196f3] text-[16px] text-center">채팅</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="absolute h-[24px] left-[207.81px] top-0 w-[50px]" data-name="List Item">
      <Icon31 />
      <Text21 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="absolute left-0 size-[14px] top-[7.56px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #FF5722)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute content-stretch flex h-[21.333px] items-start left-[18px] top-[1.33px] w-[64px]" data-name="Text">
      <p className="basis-0 font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#ff5722] text-[16px] text-center">홈페이지</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="absolute h-[24px] left-[89px] top-[24px] w-[82px]" data-name="List Item">
      <Icon32 />
      <Text22 />
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute h-[48px] left-[5px] top-[247px] w-[270px]" data-name="Legend">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
    </div>
  );
}

function CardContent5() {
  return (
    <div className="absolute h-[300px] left-[24px] top-[94px] w-[280px]" data-name="CardContent">
      <Icon27 />
      <Legend />
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-neutral-950 border-[0.667px] border-neutral-800 border-solid h-[469.333px] left-[690.67px] rounded-[14px] top-0 w-[329.333px]" data-name="Card">
      <CardHeader6 />
      <CardContent5 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute h-[469.333px] left-[24px] top-[752.67px] w-[1020px]" data-name="Container">
      <Card5 />
      <Card6 />
    </div>
  );
}

function CardTitle7() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-50 text-nowrap top-[-1.67px] whitespace-pre">활성화 요일</p>
    </div>
  );
}

function CardDescription3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#a1a1a1] text-[16px] top-[-1.67px] w-[257px]">2025년 12월 요일별 문의 건수 분포</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[40px] relative shrink-0 w-[257px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[40px] items-start relative w-[257px]">
        <CardTitle7 />
        <CardDescription3 />
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="basis-0 bg-neutral-800 grow h-[32px] min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0" data-name="Primitive.button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[6px] py-0 relative w-full">
          <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 text-nowrap whitespace-pre">문의건</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0)] grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="Primitive.button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[6px] py-0 relative w-full">
          <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 text-nowrap whitespace-pre">수임건</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0)] grow h-[32px] min-h-px min-w-px relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="Primitive.button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[6px] py-0 relative w-full">
          <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 text-nowrap whitespace-pre">수임율</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="basis-0 grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-center relative w-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="absolute left-[10.67px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[32px] relative rounded-[8px] shrink-0 w-[80.76px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[80.76px]">
        <Icon33 />
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[56.17px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[4.67px] translate-x-[-50%] whitespace-pre">12월</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[32px] relative shrink-0 w-[250.76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center relative w-[250.76px]">
        <PrimitiveDiv />
        <Button12 />
      </div>
    </div>
  );
}

function WeekdayChart() {
  return (
    <div className="absolute content-stretch flex h-[40px] items-start justify-between left-[24px] top-[24px] w-[970.667px]" data-name="WeekdayChart">
      <Container35 />
      <Container36 />
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute inset-[1.67%_0.51%_11.67%_6.69%]" data-name="Group">
      <div className="absolute bottom-[-0.19%] left-0 right-0 top-[-0.19%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 901 261">
          <g id="Group">
            <path d="M0 260.5H901" id="Vector" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 195.5H901" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 130.5H901" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 65.5H901" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 0.5H901" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute inset-[1.67%_0.51%_11.67%_6.69%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.06%] right-[-0.06%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 902 260">
          <g id="Group">
            <path d="M64.8571 0V260" id="Vector" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M193.571 0V260" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M322.286 0V260" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M451 0V260" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M579.714 0V260" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M708.429 0V260" id="Vector_6" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M837.143 0V260" id="Vector_7" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0.5 0V260" id="Vector_8" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M901.5 0V260" id="Vector_9" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute contents inset-[1.67%_0.51%_11.67%_6.69%]" data-name="Group">
      <Group32 />
      <Group33 />
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents inset-[89.84%_86.06%_5.16%_12.7%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_86.06%_5.16%_12.7%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">일</p>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute contents inset-[89.84%_72.8%_5.16%_25.96%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_72.8%_5.16%_25.96%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">월</p>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute contents inset-[89.84%_59.55%_5.16%_39.22%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_59.55%_5.16%_39.22%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">화</p>
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute contents inset-[89.84%_46.29%_5.16%_52.47%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_46.29%_5.16%_52.47%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">수</p>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute contents inset-[89.84%_33.04%_5.16%_65.73%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_33.04%_5.16%_65.73%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">목</p>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute contents inset-[89.84%_19.78%_5.16%_78.98%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_19.78%_5.16%_78.98%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">금</p>
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute contents inset-[89.84%_6.52%_5.16%_92.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_6.52%_5.16%_92.24%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">토</p>
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute contents inset-[89.84%_6.52%_5.16%_12.7%]" data-name="Group">
      <Group35 />
      <Group36 />
      <Group37 />
      <Group38 />
      <Group39 />
      <Group40 />
      <Group41 />
    </div>
  );
}

function Group43() {
  return (
    <div className="absolute contents inset-[89.84%_6.52%_5.16%_12.7%]" data-name="Group">
      <Group42 />
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute contents inset-[85.75%_94.13%_9.25%_5.05%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[85.75%_94.13%_9.25%_5.05%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">0</p>
    </div>
  );
}

function Group45() {
  return (
    <div className="absolute contents inset-[64.09%_94.13%_30.91%_4.53%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[64.09%_94.13%_30.91%_4.53%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">15</p>
    </div>
  );
}

function Group46() {
  return (
    <div className="absolute contents inset-[42.42%_94.13%_52.58%_4.22%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[42.42%_94.13%_52.58%_4.22%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">30</p>
    </div>
  );
}

function Group47() {
  return (
    <div className="absolute contents inset-[20.75%_94.13%_74.25%_4.33%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[20.75%_94.13%_74.25%_4.33%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">45</p>
    </div>
  );
}

function Group48() {
  return (
    <div className="absolute contents inset-[0.42%_94.13%_94.58%_4.33%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[0.42%_94.13%_94.58%_4.33%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">60</p>
    </div>
  );
}

function Group49() {
  return (
    <div className="absolute contents inset-[0.42%_94.13%_9.25%_4.22%]" data-name="Group">
      <Group44 />
      <Group45 />
      <Group46 />
      <Group47 />
      <Group48 />
    </div>
  );
}

function Group50() {
  return (
    <div className="absolute contents inset-[0.42%_94.13%_9.25%_0.23%]" data-name="Group">
      <Group49 />
      <div className="absolute flex inset-[29%_98.22%_55%_0.23%] items-center justify-center">
        <div className="flex-none h-[15px] rotate-[270deg] w-[48px]">
          <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative text-[12px] text-[grey] text-nowrap whitespace-pre">문의 건수</p>
        </div>
      </div>
    </div>
  );
}

function Group51() {
  return (
    <div className="absolute inset-[63.78%_81.48%_11.67%_8.02%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 74">
        <g id="Group">
          <path d={svgPaths.p26606d80} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group52() {
  return (
    <div className="absolute inset-[17.56%_68.22%_11.67%_21.28%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 213">
        <g id="Group">
          <path d={svgPaths.p180f3f00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group53() {
  return (
    <div className="absolute inset-[19%_54.96%_11.67%_34.53%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 208">
        <g id="Group">
          <path d={svgPaths.p2a17d580} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group54() {
  return (
    <div className="absolute inset-[14.67%_41.71%_11.67%_47.79%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 221">
        <g id="Group">
          <path d={svgPaths.p104d0a00} fill="var(--fill-0, #4CAF50)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group55() {
  return (
    <div className="absolute inset-[33.44%_28.45%_11.67%_61.04%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 165">
        <g id="Group">
          <path d={svgPaths.p17494100} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group56() {
  return (
    <div className="absolute inset-[29.11%_15.2%_11.67%_74.3%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 178">
        <g id="Group">
          <path d={svgPaths.p2039ec80} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group57() {
  return (
    <div className="absolute inset-[60.89%_1.94%_11.67%_87.55%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 83">
        <g id="Group">
          <path d={svgPaths.p18d56d00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group58() {
  return (
    <div className="absolute contents inset-[14.67%_1.94%_11.67%_8.02%]" data-name="Group">
      <Group51 />
      <Group52 />
      <Group53 />
      <Group54 />
      <Group55 />
      <Group56 />
      <Group57 />
    </div>
  );
}

function Group59() {
  return (
    <div className="absolute contents inset-[14.67%_1.94%_11.67%_8.02%]" data-name="Group">
      <Group58 />
    </div>
  );
}

function Group60() {
  return (
    <div className="absolute contents inset-[14.67%_1.94%_11.67%_8.02%]" data-name="Group">
      <Group59 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="absolute h-[300px] left-0 overflow-clip top-0 w-[971px]" data-name="Icon">
      <Group34 />
      <Group43 />
      <Group50 />
      <Group60 />
    </div>
  );
}

function CardContent6() {
  return (
    <div className="absolute h-[300px] left-[24px] top-[94px] w-[971px]" data-name="CardContent">
      <Icon34 />
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-neutral-950 border-[0.667px] border-neutral-800 border-solid h-[419.333px] left-[24px] rounded-[14px] top-[1246px] w-[1020px]" data-name="Card">
      <WeekdayChart />
      <CardContent6 />
    </div>
  );
}

function CardTitle8() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-50 text-nowrap top-[-1.67px] whitespace-pre">활성화 시간</p>
    </div>
  );
}

function CardDescription4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#a1a1a1] text-[16px] top-[-1.67px] w-[241px]">2025년 12월 일별 문의 건수 분포</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[40px] relative shrink-0 w-[241px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[40px] items-start relative w-[241px]">
        <CardTitle8 />
        <CardDescription4 />
      </div>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="basis-0 bg-neutral-800 grow h-[32px] min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0" data-name="Primitive.button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[6px] py-0 relative w-full">
          <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 text-nowrap whitespace-pre">문의건</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0)] grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="Primitive.button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[6px] py-0 relative w-full">
          <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 text-nowrap whitespace-pre">수임건</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton5() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0)] grow h-[32px] min-h-px min-w-px relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="Primitive.button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[6px] py-0 relative w-full">
          <p className="font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 text-nowrap whitespace-pre">수임율</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv1() {
  return (
    <div className="basis-0 grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-center relative w-full">
        <PrimitiveButton3 />
        <PrimitiveButton4 />
        <PrimitiveButton5 />
      </div>
    </div>
  );
}

function Icon35() {
  return (
    <div className="absolute left-[10.67px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[32px] relative rounded-[8px] shrink-0 w-[80.76px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[80.76px]">
        <Icon35 />
        <p className="absolute font-['Arial:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] left-[56.17px] not-italic text-[14px] text-center text-neutral-50 text-nowrap top-[4.67px] translate-x-[-50%] whitespace-pre">12월</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[32px] relative shrink-0 w-[250.76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[32px] items-center relative w-[250.76px]">
        <PrimitiveDiv1 />
        <Button13 />
      </div>
    </div>
  );
}

function TopPagesTable() {
  return (
    <div className="absolute content-stretch flex h-[40px] items-start justify-between left-[24px] top-[24px] w-[970.667px]" data-name="TopPagesTable">
      <Container37 />
      <Container38 />
    </div>
  );
}

function Group61() {
  return (
    <div className="absolute inset-[1.67%_0.51%_11.67%_6.69%]" data-name="Group">
      <div className="absolute bottom-[-0.19%] left-0 right-0 top-[-0.19%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 901 261">
          <g id="Group">
            <path d="M0 260.5H901" id="Vector" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 195.5H901" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 130.5H901" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 65.5H901" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0 0.5H901" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group62() {
  return (
    <div className="absolute inset-[1.67%_0.51%_11.67%_6.69%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.06%] right-[-0.06%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 902 260">
          <g id="Group">
            <path d="M15.0323 0V260" id="Vector" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M44.0968 0V260" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M73.1613 0V260" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M102.226 0V260" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M131.29 0V260" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M160.355 0V260" id="Vector_6" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M189.419 0V260" id="Vector_7" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M218.484 0V260" id="Vector_8" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M247.548 0V260" id="Vector_9" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M276.613 0V260" id="Vector_10" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M305.677 0V260" id="Vector_11" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M334.742 0V260" id="Vector_12" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M363.806 0V260" id="Vector_13" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M392.871 0V260" id="Vector_14" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M421.935 0V260" id="Vector_15" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M451 0V260" id="Vector_16" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M480.065 0V260" id="Vector_17" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M509.129 0V260" id="Vector_18" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M538.194 0V260" id="Vector_19" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M567.258 0V260" id="Vector_20" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M596.323 0V260" id="Vector_21" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M625.387 0V260" id="Vector_22" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M654.452 0V260" id="Vector_23" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M683.516 0V260" id="Vector_24" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M712.581 0V260" id="Vector_25" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M741.645 0V260" id="Vector_26" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M770.71 0V260" id="Vector_27" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M799.774 0V260" id="Vector_28" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M828.839 0V260" id="Vector_29" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M857.903 0V260" id="Vector_30" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M886.968 0V260" id="Vector_31" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M0.5 0V260" id="Vector_32" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
            <path d="M901.5 0V260" id="Vector_33" stroke="var(--stroke-0, #262626)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group63() {
  return (
    <div className="absolute contents inset-[1.67%_0.51%_11.67%_6.69%]" data-name="Group">
      <Group61 />
      <Group62 />
    </div>
  );
}

function Group64() {
  return (
    <div className="absolute contents inset-[89.84%_91.5%_5.16%_7.88%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_91.5%_5.16%_7.88%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">1</p>
    </div>
  );
}

function Group65() {
  return (
    <div className="absolute contents inset-[89.84%_88.4%_5.16%_10.77%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_88.4%_5.16%_10.77%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">2</p>
    </div>
  );
}

function Group66() {
  return (
    <div className="absolute contents inset-[89.84%_85.41%_5.16%_13.77%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_85.41%_5.16%_13.77%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">3</p>
    </div>
  );
}

function Group67() {
  return (
    <div className="absolute contents inset-[89.84%_82.42%_5.16%_16.76%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_82.42%_5.16%_16.76%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">4</p>
    </div>
  );
}

function Group68() {
  return (
    <div className="absolute contents inset-[89.84%_79.42%_5.16%_19.75%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_79.42%_5.16%_19.75%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">5</p>
    </div>
  );
}

function Group69() {
  return (
    <div className="absolute contents inset-[89.84%_76.43%_5.16%_22.75%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_76.43%_5.16%_22.75%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">6</p>
    </div>
  );
}

function Group70() {
  return (
    <div className="absolute contents inset-[89.84%_73.49%_5.16%_25.79%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_73.49%_5.16%_25.79%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">7</p>
    </div>
  );
}

function Group71() {
  return (
    <div className="absolute contents inset-[89.84%_70.44%_5.16%_28.73%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_70.44%_5.16%_28.73%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">8</p>
    </div>
  );
}

function Group72() {
  return (
    <div className="absolute contents inset-[89.84%_67.45%_5.16%_31.72%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_67.45%_5.16%_31.72%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">9</p>
    </div>
  );
}

function Group73() {
  return (
    <div className="absolute contents inset-[89.84%_64.15%_5.16%_34.41%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_64.15%_5.16%_34.41%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">10</p>
    </div>
  );
}

function Group74() {
  return (
    <div className="absolute contents inset-[89.84%_61.26%_5.16%_37.51%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_61.26%_5.16%_37.51%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">11</p>
    </div>
  );
}

function Group75() {
  return (
    <div className="absolute contents inset-[89.84%_58.21%_5.16%_40.45%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_58.21%_5.16%_40.45%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">12</p>
    </div>
  );
}

function Group76() {
  return (
    <div className="absolute contents inset-[89.84%_55.17%_5.16%_43.39%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_55.17%_5.16%_43.39%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">13</p>
    </div>
  );
}

function Group77() {
  return (
    <div className="absolute contents inset-[89.84%_52.18%_5.16%_46.38%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_52.18%_5.16%_46.38%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">14</p>
    </div>
  );
}

function Group78() {
  return (
    <div className="absolute contents inset-[89.84%_49.23%_5.16%_49.43%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_49.23%_5.16%_49.43%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">15</p>
    </div>
  );
}

function Group79() {
  return (
    <div className="absolute contents inset-[89.84%_46.19%_5.16%_52.37%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_46.19%_5.16%_52.37%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">16</p>
    </div>
  );
}

function Group80() {
  return (
    <div className="absolute contents inset-[89.84%_43.25%_5.16%_55.41%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_43.25%_5.16%_55.41%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">17</p>
    </div>
  );
}

function Group81() {
  return (
    <div className="absolute contents inset-[89.84%_40.25%_5.16%_58.41%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_40.25%_5.16%_58.41%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">18</p>
    </div>
  );
}

function Group82() {
  return (
    <div className="absolute contents inset-[89.84%_37.21%_5.16%_61.35%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_37.21%_5.16%_61.35%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">19</p>
    </div>
  );
}

function Group83() {
  return (
    <div className="absolute contents inset-[89.84%_34.16%_5.16%_64.29%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_34.16%_5.16%_64.29%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">20</p>
    </div>
  );
}

function Group84() {
  return (
    <div className="absolute contents inset-[89.84%_31.27%_5.16%_67.39%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_31.27%_5.16%_67.39%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">21</p>
    </div>
  );
}

function Group85() {
  return (
    <div className="absolute contents inset-[89.84%_28.18%_5.16%_70.28%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_28.18%_5.16%_70.28%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">22</p>
    </div>
  );
}

function Group86() {
  return (
    <div className="absolute contents inset-[89.84%_25.19%_5.16%_73.27%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_25.19%_5.16%_73.27%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">23</p>
    </div>
  );
}

function Group87() {
  return (
    <div className="absolute contents inset-[89.84%_22.19%_5.16%_76.26%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_22.19%_5.16%_76.26%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">24</p>
    </div>
  );
}

function Group88() {
  return (
    <div className="absolute contents inset-[89.84%_19.2%_5.16%_79.26%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_19.2%_5.16%_79.26%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">25</p>
    </div>
  );
}

function Group89() {
  return (
    <div className="absolute contents inset-[89.84%_16.21%_5.16%_82.25%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_16.21%_5.16%_82.25%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">26</p>
    </div>
  );
}

function Group90() {
  return (
    <div className="absolute contents inset-[89.84%_13.21%_5.16%_85.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_13.21%_5.16%_85.24%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">27</p>
    </div>
  );
}

function Group91() {
  return (
    <div className="absolute contents inset-[89.84%_10.22%_5.16%_88.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_10.22%_5.16%_88.24%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">28</p>
    </div>
  );
}

function Group92() {
  return (
    <div className="absolute contents inset-[89.84%_7.23%_5.16%_91.23%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_7.23%_5.16%_91.23%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">29</p>
    </div>
  );
}

function Group93() {
  return (
    <div className="absolute contents inset-[89.84%_4.18%_5.16%_94.17%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_4.18%_5.16%_94.17%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">30</p>
    </div>
  );
}

function Group94() {
  return (
    <div className="absolute contents inset-[89.84%_1.29%_5.16%_97.27%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[89.84%_1.29%_5.16%_97.27%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">31</p>
    </div>
  );
}

function Group95() {
  return (
    <div className="absolute contents inset-[89.84%_1.29%_5.16%_7.88%]" data-name="Group">
      <Group64 />
      <Group65 />
      <Group66 />
      <Group67 />
      <Group68 />
      <Group69 />
      <Group70 />
      <Group71 />
      <Group72 />
      <Group73 />
      <Group74 />
      <Group75 />
      <Group76 />
      <Group77 />
      <Group78 />
      <Group79 />
      <Group80 />
      <Group81 />
      <Group82 />
      <Group83 />
      <Group84 />
      <Group85 />
      <Group86 />
      <Group87 />
      <Group88 />
      <Group89 />
      <Group90 />
      <Group91 />
      <Group92 />
      <Group93 />
      <Group94 />
    </div>
  );
}

function Group96() {
  return (
    <div className="absolute contents inset-[89.84%_1.29%_-1%_7.88%]" data-name="Group">
      <Group95 />
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[96%_46.29%_-1%_52.47%] leading-[normal] not-italic text-[12px] text-[grey] text-center text-nowrap whitespace-pre">일</p>
    </div>
  );
}

function Group97() {
  return (
    <div className="absolute contents inset-[85.75%_94.13%_9.25%_5.05%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[85.75%_94.13%_9.25%_5.05%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">0</p>
    </div>
  );
}

function Group98() {
  return (
    <div className="absolute contents inset-[64.09%_94.13%_30.91%_5.05%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[64.09%_94.13%_30.91%_5.05%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">5</p>
    </div>
  );
}

function Group99() {
  return (
    <div className="absolute contents inset-[42.42%_94.13%_52.58%_4.43%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[42.42%_94.13%_52.58%_4.43%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">10</p>
    </div>
  );
}

function Group100() {
  return (
    <div className="absolute contents inset-[20.75%_94.13%_74.25%_4.53%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[20.75%_94.13%_74.25%_4.53%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">15</p>
    </div>
  );
}

function Group101() {
  return (
    <div className="absolute contents inset-[0.42%_94.13%_94.58%_4.33%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[0.42%_94.13%_94.58%_4.33%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">20</p>
    </div>
  );
}

function Group102() {
  return (
    <div className="absolute contents inset-[0.42%_94.13%_9.25%_4.33%]" data-name="Group">
      <Group97 />
      <Group98 />
      <Group99 />
      <Group100 />
      <Group101 />
    </div>
  );
}

function Group103() {
  return (
    <div className="absolute contents inset-[0.42%_94.13%_9.25%_0.23%]" data-name="Group">
      <Group102 />
      <div className="absolute flex inset-[29%_98.22%_55%_0.23%] items-center justify-center">
        <div className="flex-none h-[15px] rotate-[270deg] w-[48px]">
          <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative text-[12px] text-[grey] text-nowrap whitespace-pre">문의 건수</p>
        </div>
      </div>
    </div>
  );
}

function Group104() {
  return (
    <div className="absolute inset-[40.67%_90.64%_11.67%_6.99%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 143">
        <g id="Group">
          <path d={svgPaths.p3b98f880} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group105() {
  return (
    <div className="absolute inset-[23.33%_87.64%_11.67%_9.99%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 195">
        <g id="Group">
          <path d={svgPaths.p305f40f0} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group106() {
  return (
    <div className="absolute inset-[23.33%_84.65%_11.67%_12.98%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 195">
        <g id="Group">
          <path d={svgPaths.pd94f140} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group107() {
  return (
    <div className="absolute inset-[14.67%_81.66%_11.67%_15.97%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 221">
        <g id="Group">
          <path d={svgPaths.p32654c00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group108() {
  return (
    <div className="absolute inset-[23.33%_78.66%_11.67%_18.97%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 195">
        <g id="Group">
          <path d={svgPaths.p305f40f0} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group109() {
  return (
    <div className="absolute inset-[75.33%_75.67%_11.67%_21.96%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 39">
        <g id="Group">
          <path d={svgPaths.p2500af80} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group110() {
  return (
    <div className="absolute inset-[66.67%_72.68%_11.67%_24.95%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 65">
        <g id="Group">
          <path d={svgPaths.p2acc6e00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group111() {
  return (
    <div className="absolute inset-[32%_69.69%_11.67%_27.95%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 169">
        <g id="Group">
          <path d={svgPaths.pb04df00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group112() {
  return (
    <div className="absolute inset-[32%_66.69%_11.67%_30.94%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 169">
        <g id="Group">
          <path d={svgPaths.pb04df00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group113() {
  return (
    <div className="absolute inset-[10.33%_63.7%_11.67%_33.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 234">
        <g id="Group">
          <path d={svgPaths.p390cb4c0} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group114() {
  return (
    <div className="absolute inset-[32%_60.71%_11.67%_36.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 169">
        <g id="Group">
          <path d={svgPaths.pb04df00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group115() {
  return (
    <div className="absolute inset-[27.67%_57.71%_11.67%_39.92%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 182">
        <g id="Group">
          <path d={svgPaths.p13065700} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group116() {
  return (
    <div className="absolute inset-[75.33%_54.72%_11.67%_42.91%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 39">
        <g id="Group">
          <path d={svgPaths.p2500af80} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group117() {
  return (
    <div className="absolute inset-[71%_51.73%_11.67%_45.91%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 52">
        <g id="Group">
          <path d={svgPaths.pfcf7b00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group118() {
  return (
    <div className="absolute inset-[40.67%_48.73%_11.67%_48.9%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 143">
        <g id="Group">
          <path d={svgPaths.p238dfd00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group119() {
  return (
    <div className="absolute inset-[6%_45.74%_11.67%_51.89%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 247">
        <g id="Group">
          <path d={svgPaths.p2df66bc0} fill="var(--fill-0, #FF5722)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group120() {
  return (
    <div className="absolute inset-[36.33%_42.75%_11.67%_54.89%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 156">
        <g id="Group">
          <path d={svgPaths.p2ab4d880} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group121() {
  return (
    <div className="absolute inset-[27.67%_39.75%_11.67%_57.88%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 182">
        <g id="Group">
          <path d={svgPaths.p13065700} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group122() {
  return (
    <div className="absolute inset-[6%_36.76%_11.67%_60.87%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 247">
        <g id="Group">
          <path d={svgPaths.p2df66bc0} fill="var(--fill-0, #FF5722)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group123() {
  return (
    <div className="absolute inset-[62.33%_33.77%_11.67%_63.87%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 78">
        <g id="Group">
          <path d={svgPaths.p351e3000} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group124() {
  return (
    <div className="absolute inset-[58%_30.77%_11.67%_66.86%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 91">
        <g id="Group">
          <path d={svgPaths.p218e4d72} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group125() {
  return (
    <div className="absolute inset-[19%_27.78%_11.67%_69.85%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 208">
        <g id="Group">
          <path d={svgPaths.p2f628200} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group126() {
  return (
    <div className="absolute inset-[45%_24.79%_11.67%_72.85%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 130">
        <g id="Group">
          <path d={svgPaths.p3625d400} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group127() {
  return (
    <div className="absolute inset-[27.67%_21.79%_11.67%_75.84%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 182">
        <g id="Group">
          <path d={svgPaths.p13065700} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group128() {
  return (
    <div className="absolute inset-[14.67%_18.8%_11.67%_78.83%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 221">
        <g id="Group">
          <path d={svgPaths.p32654c00} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group129() {
  return (
    <div className="absolute inset-[36.33%_15.81%_11.67%_81.82%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 156">
        <g id="Group">
          <path d={svgPaths.p2ab4d880} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group130() {
  return (
    <div className="absolute inset-[40.67%_12.81%_11.67%_84.82%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 143">
        <g id="Group">
          <path d={svgPaths.pc69e600} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group131() {
  return (
    <div className="absolute inset-[49.33%_9.82%_11.67%_87.81%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 117">
        <g id="Group">
          <path d={svgPaths.p26c13100} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group132() {
  return (
    <div className="absolute inset-[23.33%_6.83%_11.67%_90.8%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 195">
        <g id="Group">
          <path d={svgPaths.p305f40f0} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group133() {
  return (
    <div className="absolute inset-[10.33%_3.83%_11.67%_93.8%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 234">
        <g id="Group">
          <path d={svgPaths.p390cb4c0} fill="var(--fill-0, #E0E0E0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group134() {
  return (
    <div className="absolute inset-[6%_0.84%_11.67%_96.79%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 247">
        <g id="Group">
          <path d={svgPaths.p2df66bc0} fill="var(--fill-0, #FF5722)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group135() {
  return (
    <div className="absolute contents inset-[6%_0.84%_11.67%_6.99%]" data-name="Group">
      <Group104 />
      <Group105 />
      <Group106 />
      <Group107 />
      <Group108 />
      <Group109 />
      <Group110 />
      <Group111 />
      <Group112 />
      <Group113 />
      <Group114 />
      <Group115 />
      <Group116 />
      <Group117 />
      <Group118 />
      <Group119 />
      <Group120 />
      <Group121 />
      <Group122 />
      <Group123 />
      <Group124 />
      <Group125 />
      <Group126 />
      <Group127 />
      <Group128 />
      <Group129 />
      <Group130 />
      <Group131 />
      <Group132 />
      <Group133 />
      <Group134 />
    </div>
  );
}

function Group136() {
  return (
    <div className="absolute contents inset-[6%_0.84%_11.67%_6.99%]" data-name="Group">
      <Group135 />
    </div>
  );
}

function Group137() {
  return (
    <div className="absolute contents inset-[6%_0.84%_11.67%_6.99%]" data-name="Group">
      <Group136 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="absolute h-[300px] left-0 overflow-clip top-0 w-[971px]" data-name="Icon">
      <Group63 />
      <Group96 />
      <Group103 />
      <Group137 />
    </div>
  );
}

function CardContent7() {
  return (
    <div className="absolute h-[300px] left-[24px] top-[94px] w-[971px]" data-name="CardContent">
      <Icon36 />
    </div>
  );
}

function Card8() {
  return (
    <div className="absolute bg-neutral-950 border-[0.667px] border-neutral-800 border-solid h-[419.333px] left-[24px] rounded-[14px] top-[1689.33px] w-[1020px]" data-name="Card">
      <TopPagesTable />
      <CardContent7 />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="h-[2132.67px] relative shrink-0 w-full" data-name="Dashboard">
      <Container8 />
      <Container9 />
      <Card4 />
      <Container34 />
      <Card7 />
      <Card8 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="basis-0 grow h-[1120.67px] min-h-px min-w-px relative shrink-0" data-name="Main Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[1120.67px] items-start pl-0 pr-[15.333px] py-0 relative w-full">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1339.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-start overflow-clip relative rounded-[inherit] w-[1339.33px]">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-neutral-950 content-stretch flex flex-col h-[1305.33px] items-start left-0 top-0 w-[1339.33px]" data-name="App">
      <Header />
      <ServerStatusBanner />
      <Container39 />
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute h-[18px] left-0 top-[-20000px] w-[6.615px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-1.33px] whitespace-pre">5</p>
    </div>
  );
}

export default function GoogleAnalyticsDashboard() {
  return (
    <div className="bg-neutral-950 relative size-full" data-name="Google Analytics Dashboard">
      <App />
      <Text23 />
    </div>
  );
}