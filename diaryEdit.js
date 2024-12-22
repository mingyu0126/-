document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const content = params.get("content"); // URL에서 기존 일기 내용을 가져옵니다.

    const originalDiaryElement = document.getElementById("original-diary");
    const editDiaryElement = document.getElementById("edit-diary");

    if (content) {
        try {
            const parsedContent = JSON.parse(decodeURIComponent(content)); // JSON 파싱
            originalDiaryElement.textContent = parsedContent.content; // 기존 일기 내용을 표시
            editDiaryElement.value = parsedContent.content; // 수정할 내용으로 기존 일기 내용을 표시
        } catch (error) {
            console.error("일기 내용 파싱 오류:", error.message);
        }

        // content 파라미터 제거
        params.delete("content");
        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.replaceState({}, '', newUrl); // URL 업데이트
    }

    // 저장 버튼 클릭 처리
    document.querySelector(".save-button").addEventListener("click", () => {
        const updatedContent = editDiaryElement.value; // 수정된 일기 내용 가져오기
        const date = params.get("date"); // 수정할 날짜 가져오기
        const token = localStorage.getItem("token");

        console.log("Date:", date); // 추가된 로그
        console.log("Updated Content:", updatedContent); // 추가된 로그

        fetch(`http://localhost:8080/diary/update?date=${date}`, {
            method: "PUT",
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: updatedContent })
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