// 현재 날짜를 가져와 표시하는 함수
function displayCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById("current-date").textContent = formattedDate;
}

// 현재 날짜 포맷 함수
function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 페이지 로드 시 날짜 표시 및 저장된 일기 확인
window.onload = function () {
    const today = getFormattedDate();
    const diaryData = localStorage.getItem(today);

    if (diaryData) {
        // 이미 저장된 일기가 있으면 diaryDetail 페이지로 이동
        window.location.href = `diaryDetail.html?date=${today}`;
    } else {
        // 현재 날짜 표시
        displayCurrentDate();
    }
};

// 저장 버튼 클릭 이벤트 처리
document.querySelector(".save-button").addEventListener("click", () => {
    const currentDate = document.getElementById("current-date").textContent;
    const diaryContent = document.querySelector(".diary-content").value.trim();

    if (diaryContent === "") {
        alert("일기를 작성해주세요!");
        return;
    }

    // 로컬스토리지에 저장
    localStorage.setItem(currentDate, diaryContent);

    // 사용자 데이터 업데이트 (My Page와 연동)
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    userData.diaryCount = (userData.diaryCount || 0) + 1; // 작성한 다이어리 수 증가
    userData.lastDiaryDate = currentDate; // 마지막 작성 날짜 업데이트
    localStorage.setItem("userData", JSON.stringify(userData));

    alert("일기가 저장되었습니다.");

    // 저장 후 diaryDetail 페이지로 이동
    window.location.href = `diaryDetail.html?date=${currentDate}`;
});

// 캘린더에서 특정 날짜 클릭 시 DiaryDetail 페이지로 이동하도록 설정
document.querySelectorAll(".date").forEach(dateElement => {
    dateElement.addEventListener("click", () => {
        const selectedDate = dateElement.textContent.trim(); // 선택된 날짜 텍스트
        const year = new Date().getFullYear(); // 현재 연도
        const month = String(new Date().getMonth() + 1).padStart(2, '0'); // 현재 월

        const formattedDate = `${year}-${month}-${selectedDate.padStart(2, '0')}`;
        window.location.href = `diaryDetail.html?date=${formattedDate}`;
    });
});

// 다이어리 상세 페이지에서 데이터를 표시하는 함수
function displayDiaryDetail(date) {
    const diaryData = localStorage.getItem(date);
    if (diaryData) {
        document.querySelector(".diary-detail-content").textContent = diaryData;
    } else {
        alert("해당 날짜의 일기가 없습니다.");
        window.location.href = "diary.html"; // 다이어리 작성 페이지로 리다이렉트
    }
}

// 상세 페이지에서 삭제 버튼 클릭 처리
document.querySelector(".delete-button")?.addEventListener("click", () => {
    const currentDate = new URLSearchParams(window.location.search).get("date");

    if (currentDate && localStorage.getItem(currentDate)) {
        const confirmDelete = confirm("정말로 이 일기를 삭제하시겠습니까?");
        if (confirmDelete) {
            localStorage.removeItem(currentDate);

            // 사용자 데이터 업데이트 (My Page와 연동)
            const userData = JSON.parse(localStorage.getItem("userData")) || {};
            userData.diaryCount = Math.max((userData.diaryCount || 1) - 1, 0); // 작성한 다이어리 수 감소
            localStorage.setItem("userData", JSON.stringify(userData));

            alert("일기가 삭제되었습니다.");
            window.location.href = "diary.html"; // 다이어리 작성 페이지로 리다이렉트
        }
    } else {
        alert("삭제할 일기가 없습니다.");
    }
});
