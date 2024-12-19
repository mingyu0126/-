let CDate = new Date(); // 현재 캘린더 날짜
let today = new Date(); // 오늘 날짜

// 초기 캘린더 생성
buildCalendar();

function buildCalendar() {
  const prevLast = new Date(CDate.getFullYear(), CDate.getMonth(), 0); // 이전 달 마지막 날
  const thisFirst = new Date(CDate.getFullYear(), CDate.getMonth(), 1); // 이번 달 첫 번째 날
  const thisLast = new Date(CDate.getFullYear(), CDate.getMonth() + 1, 0); // 이번 달 마지막 날

  // 연도 및 월 업데이트
  document.querySelector(".yearTitle").textContent = CDate.getFullYear();
  document.querySelector(".monthTitle").textContent = String(CDate.getMonth() + 1).padStart(2, '0');

  // 날짜 배열 생성
  let dates = [];

  // 이전 달 날짜 추가
  for (let i = thisFirst.getDay() - 1; i >= 0; i--) {
    dates.push({
      date: prevLast.getDate() - i,
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜 추가
  for (let i = 1; i <= thisLast.getDate(); i++) {
    dates.push({
      date: i,
      isCurrentMonth: true,
    });
  }

  // 다음 달 날짜 추가
  for (let i = 1; dates.length < 42; i++) {
    dates.push({
      date: i,
      isCurrentMonth: false,
    });
  }

  // HTML 렌더링
  let htmlDates = '';
  dates.forEach((dateObj, i) => {
    const isToday =
      today.getDate() === dateObj.date &&
      today.getMonth() === CDate.getMonth() &&
      today.getFullYear() === CDate.getFullYear();

    const notCurrentClass = dateObj.isCurrentMonth ? '' : 'not-current-month';
    const todayClass = isToday ? 'today' : '';

    const dayClass = (i % 7 === 0) // 일요일
      ? 'sunday'
      : (i % 7 === 6) // 토요일
      ? 'saturday'
      : '';

    htmlDates += `<div class="date ${notCurrentClass} ${todayClass} ${dayClass}" data-date="${dateObj.date}" data-current="${dateObj.isCurrentMonth}">${dateObj.date}</div>`;
  });

  document.querySelector(".dates").innerHTML = htmlDates;

  // 날짜 클릭 이벤트 추가
  addDateClickEvents();
}

// 이전 달 이동
function prevCal() {
  CDate.setMonth(CDate.getMonth() - 1); // 이전 달로 이동
  buildCalendar();
}

// 다음 달 이동
function nextCal() {
  CDate.setMonth(CDate.getMonth() + 1); // 다음 달로 이동
  buildCalendar();
}

// 날짜 클릭 이벤트 추가
function addDateClickEvents() {
  document.querySelectorAll(".date").forEach(dateElement => {
    dateElement.addEventListener("click", () => {
      const date = dateElement.dataset.date; // 클릭된 날짜
      const isCurrentMonth = dateElement.dataset.current === "true";

      if (!isCurrentMonth) return; // 이전/다음 달 날짜는 클릭 시 무시

      const year = CDate.getFullYear(); // 현재 연도
      const month = String(CDate.getMonth() + 1).padStart(2, '0'); // 현재 월
      const formattedDate = `${year}-${month}-${String(date).padStart(2, '0')}`;

      // diaryDetail.html로 이동
      window.location.href = `diaryDetail.html?date=${formattedDate}`;
    });
  });
}
