document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const selectedDate = params.get("date");

  // 페이지 초기화
  const dateElement = document.getElementById("detail-date");
  const diaryContentElement = document.getElementById("diary-content");

  if (!selectedDate) {
    alert("잘못된 접근입니다.");
    window.location.href = "diary.html";
    return;
  }

  // LocalStorage에서 일기 데이터 가져오기
  const diaryData = localStorage.getItem(selectedDate);
  if (diaryData) {
    dateElement.textContent = selectedDate;
    diaryContentElement.textContent = diaryData; // 일기 내용 표시
  } else {
    alert("해당 날짜의 일기가 없습니다.");
    window.location.href = "diary.html";
    return;
  }

  // 수정 버튼 클릭 처리
  document.querySelector(".edit-button").addEventListener("click", () => {
    window.location.href = `diaryEdit.html?date=${selectedDate}`; // 수정 페이지로 이동
  });

  // 삭제 버튼 클릭 처리
  document.querySelector(".delete-button").addEventListener("click", () => {
    const confirmDelete = confirm("정말로 이 일기를 삭제하시겠습니까?");
    if (confirmDelete) {
      localStorage.removeItem(selectedDate);

      // My Page 데이터 업데이트
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      userData.diaryCount = Math.max((userData.diaryCount || 1) - 1, 0);

      // 남아 있는 일기 중 가장 최근 날짜를 찾음
      const diaryEntries = Object.keys(localStorage).filter(key =>
        key.match(/^\d{4}-\d{2}-\d{2}$/)
      );

      if (diaryEntries.length > 0) {
        userData.lastDiaryDate = diaryEntries.sort().pop(); // 가장 최신 날짜
      } else {
        userData.lastDiaryDate = "-"; // 작성된 일기가 없으면 초기화
      }

      localStorage.setItem("userData", JSON.stringify(userData));

      alert("일기가 삭제되었습니다.");
      window.location.href = "diary.html";
    }
  });
});
