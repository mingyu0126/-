document.addEventListener("DOMContentLoaded", () => {
    // LocalStorage에서 사용자 데이터 가져오기
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    if (userData) {
      // My Page에 데이터 표시
      document.getElementById("user-name").textContent = userData.name;
      document.getElementById("join-date").textContent = userData.joinDate;
      document.getElementById("diary-count").textContent = userData.diaryCount || 0;
      document.getElementById("last-diary-date").textContent = userData.lastDiaryDate || "-";
    } else {
      // 사용자 데이터가 없으면 로그인 페이지로 리다이렉트
      //alert("로그인이 필요합니다.");
      //window.location.href = "login.html";
    }

    // 계정 탈퇴 버튼 이벤트 처리
    document.querySelector(".button-secondary").addEventListener("click", () => {
      const confirmDelete = confirm("계정을 탈퇴하면 모든 데이터가 삭제됩니다. 계속하시겠습니까?");
      if (confirmDelete) {
        // LocalStorage 데이터 삭제
        localStorage.removeItem("userData");
        localStorage.removeItem("diaryEntries"); // 다이어리 데이터도 삭제
        alert("계정이 성공적으로 삭제되었습니다.");
        window.location.href = "index.html"; // 메인 페이지로 이동
      }
    });
  
    // 추가 기능: 다이어리 상세로 이동하는 버튼
    const diaryDetailButton = document.querySelector(".view-diary-button");
    if (diaryDetailButton) {
      diaryDetailButton.addEventListener("click", () => {
        const lastDiaryDate = userData.lastDiaryDate;
        if (lastDiaryDate) {
          window.location.href = `diaryDetail.html?date=${lastDiaryDate}`;
        } else {
          alert("작성된 다이어리가 없습니다.");
        }
      });
    }
  
    // 추가 기능: 전체 다이어리 보기
    const viewAllDiariesButton = document.querySelector(".view-all-diaries");
    if (viewAllDiariesButton) {
      viewAllDiariesButton.addEventListener("click", () => {
        const diaryEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
        if (diaryEntries.length > 0) {
          window.location.href = "diaryList.html"; // 다이어리 목록 페이지로 이동
        } else {
          alert("작성된 다이어리가 없습니다.");
        }
      });
    }
  });
  