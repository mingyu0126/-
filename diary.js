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

function getKSTDate() {
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC+9로 시간 조정
    return now.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
}

// 현이지 로드 시 날짜 표시 및 저장된 일기 확인
window.onload = async function () {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
        return;
    }

    const today = getKSTDate();
    console.log("오늘 날짜:", today);

    try {
        // 백엔드에서 오늘 날짜의 일기 확인
        const response = await fetch(`http://localhost:8080/diaries/user/date?date=${today}`, {
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            const diaries = await response.json();
            if (diaries && diaries.length > 0) {
                // 이미 저장된 일기가 있면 diaryDetail 페이지로 이동
                window.location.href = `diaryDetail.html?date=${today}`;
            } else {
                // 일기가 없으면 현재 날짜 표시
                displayCurrentDate();
            }
        } else {
            // API 호출 실패시 현재 날짜만 표시
            displayCurrentDate();
        }
    } catch (error) {
        console.error("일기 조회 중 오류 발생:", error);
        displayCurrentDate();
    }
};

// 저장 버튼 클릭 이벤트 처리
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".save-button").addEventListener("click", () => {
        const currentDate = document.getElementById("current-date").textContent; // 현재 날짜 가져오기
        const diaryContent = document.querySelector(".diary-content").value.trim(); // 일기 내용 가져오기

        if (diaryContent === "") {
            alert("일기를 작성해주세요!");
            return;
        }

        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = "login.html";
            return;
        }

        // 일기 저장 및 감정 분석 API 호출
        fetch("http://localhost:8080/analyze", {
            method: "POST",
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: diaryContent, // 일기 내용을 감정 분석 API에 전달
            }),
        })
        .then(response => {
            if (response.ok) {
                alert("일기와 감정 분석이 완료되었습니다!");
                window.location.href = `diaryDetail.html?date=${currentDate}`;
            } else {
                return response.text().then(errorMessage => {
                    throw new Error(errorMessage); // 오류 메시지 전달
                });
            }
        })
        .catch(error => {
            console.error("저장 중 오류 발생:", error.message);
            alert("저장하지 못했습니다. 다시 시도해주세요.");
        });
    });
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

// 다이어리 상세 페이지에 데이터를 표시하는 함수
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