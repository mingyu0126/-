// URL에서 날짜 가져오기
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

// 기존 일기를 로컬스토리지에서 가져오기
const originalDiaryElement = document.getElementById("original-diary");
const editDiaryElement = document.getElementById("edit-diary");
const savedDiary = localStorage.getItem(date);

if (savedDiary) {
    originalDiaryElement.textContent = savedDiary; // 기존 일기 표시
    editDiaryElement.value = savedDiary; // 텍스트박스에 기존 내용 로드
} else {
    originalDiaryElement.textContent = "작성된 일기가 없습니다."; // 기본 메시지
}

// 텍스트박스 입력 실시간 반영
editDiaryElement.addEventListener("input", (e) => {
    originalDiaryElement.textContent = e.target.value;
});

// 저장 버튼 클릭 시
document.querySelector(".save-button").addEventListener("click", () => {
    const updatedDiary = editDiaryElement.value;

    if (!date) {
        alert("날짜 정보가 없습니다.");
        return;
    }

    localStorage.setItem(date, updatedDiary); // 로컬스토리지에 저장
    alert("일기가 수정되었습니다.");
    window.location.href = `diaryDetail.html?date=${date}`; // 수정 완료 후 상세 페이지로 이동
});
