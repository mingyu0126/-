document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const content = params.get("content"); // URL에서 기존 일기 내용을 가져옵니다.

    const originalDiaryElement = document.getElementById("original-diary");
    const editDiaryElement = document.getElementById("edit-diary");

    if (content) {
        originalDiaryElement.textContent = content; // 기존 일기 내용을 표시
        editDiaryElement.value = content; // 수정할 내용으로 기존 일기 내용을 표시
    }

    // 저장 버튼 클릭 처리
    document.querySelector(".save-button").addEventListener("click", () => {
        const updatedContent = editDiaryElement.value; // 수정된 일기 내용 가져오기
        const date = params.get("date"); // 수정할 날짜 가져오기
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/diaries/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, content: updatedContent }) // 수정된 내용 전송
        })
        .then(response => {
            if (response.ok) {
                alert("일기가 수정되었습니다.");
                window.location.href = "diary.html"; // 수정 후 일기 목록으로 이동
            } else {
                throw new Error("일기 수정 실패");
            }
        })
        .catch(error => {
            console.error("일기 수정 중 오류 발생:", error.message);
            alert("일기를 수정하지 못했습니다.");
        });
    });
});