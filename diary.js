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

// 현재 날짜를 URL에 표시하는 함수
function updateURLWithDate() {
    const today = new URLSearchParams(window.location.search).get("date") || getFormattedDate();
    const currentURL = window.location.href;

    if (!currentURL.includes("?date=")) {
        const newURL = `${currentURL}?date=${today}`;
        history.replaceState(null, '', newURL);
    }
}

// 페이지 로드 시 날짜 표시 및 저장된 일기 확인
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const today = urlParams.get("date") || getFormattedDate();
    const token = localStorage.getItem("token");

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
        return;
    }

    updateURLWithDate();

    try {
        const response = await fetch(`http://localhost:8080/diaries/user/date?date=${today}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        // API 호출 성공 여부 확인
        if (!response.ok) {
            console.error("API 호출 실패:", response.status);
            throw new Error("서버 응답 실패");
        }

        const data = await response.json();
        console.log("API 응답 데이터:", data);

        // 데이터가 배열인지, 객체인지 확인 후 처리
        if (Array.isArray(data) && data.length > 0) {
            console.log("일기가 존재합니다. diaryDetail.html로 이동합니다.");
            window.location.href = `diaryDetail.html?date=${today}`;
            return; // 리다이렉션 후 추가 코드 실행 방지
        } else if (data && data.content) {
            console.log("일기가 존재합니다. diaryDetail.html로 이동합니다.");
            window.location.href = `diaryDetail.html?date=${today}`;
            return; // 리다이렉션 후 추가 코드 실행 방지
        } else {
            console.log("일기가 없습니다. 현재 날짜를 표시합니다.");
            displayCurrentDate();
        }
    } catch (error) {
        console.error("일기 확인 중 오류 발생:", error.message);

        // 오류 발생 시 현재 날짜만 표시하고 경고 메시지를 표시하지 않음
        displayCurrentDate();
    }
};


// 저장 버튼 클릭 이벤트 처리
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".save-button").addEventListener("click", () => {
        const currentDate = document.getElementById("current-date").textContent;
        const diaryContent = document.querySelector(".diary-content").value.trim();

        if (diaryContent === "") {
            alert("일기를 작성해주세요!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = "login.html";
            return;
        }

        fetch("http://localhost:8080/analyze", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: diaryContent,
            }),
        })
        .then(response => {
            if (response.ok) {
                alert("일기와 감정 분석이 완료되었습니다!");
                window.location.href = `diaryDetail.html?date=${currentDate}`;
            } else {
                return response.text().then(errorMessage => {
                    throw new Error(errorMessage);
                });
            }
        })
        .catch(error => {
            console.error("저장 중 오류 발생:", error.message);
            alert("저장하지 못했습니다. 다시 시도해주세요.");
        });
    });
});

// 캘린더에서 특정 날짜 클릭 시 DiaryDetail 페이지로 이동
document.querySelectorAll(".date").forEach(dateElement => {
    dateElement.addEventListener("click", () => {
        const selectedDate = dateElement.textContent.trim();
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');

        const formattedDate = `${year}-${month}-${selectedDate.padStart(2, '0')}`;
        window.location.href = `diaryDetail.html?date=${formattedDate}`;
    });
});

// 다이어리 상세 페이지에 데이터를 표시하는 함수
function displayDiaryDetail(date) {
    const diaryData = localStorage.getItem(date);
    if (diaryData) {
        document.querySelector(".diary-detail-content").textContent = diaryData;
    } else {
        alert("해당 날짜의 일기가 없습니다.");
        window.location.href = "diary.html";
    }
}

// 상세 페이지에서 삭제 버튼 클릭 처리
document.querySelector(".delete-button")?.addEventListener("click", () => {
    const currentDate = new URLSearchParams(window.location.search).get("date");

    if (currentDate && localStorage.getItem(currentDate)) {
        const confirmDelete = confirm("정말로 이 일기를 삭제하시겠습니까?");
        if (confirmDelete) {
            localStorage.removeItem(currentDate);

            const userData = JSON.parse(localStorage.getItem("userData")) || {};
            userData.diaryCount = Math.max((userData.diaryCount || 1) - 1, 0);
            localStorage.setItem("userData", JSON.stringify(userData));

            alert("일기가 삭제되었습니다.");
            window.location.href = "diary.html";
        }
    } else {
        alert("삭제할 일기가 없습니다.");
    }
});
