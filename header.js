// KST 날짜를 가져오는 함수 추가
function getKSTDate() {
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC+9로 시간 조정
    return now.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
}

document.addEventListener("DOMContentLoaded", function () {
    const currentDate = getKSTDate(); // KST 기준으로 날짜 가져오기

    const headerHTML = `
        <header class="header">
            <div class="logo">
                <a href="index.html?date=${currentDate}">
                    <img src="복사본.png" alt="FeelLog">
                </a>
            </div>
            <nav class="nav-menu">
                <a id="diary-button" href="diary.html?date=${currentDate}">Diary</a>
                <a href="eqPage.html?date=${currentDate}">EQ 높이기</a>
                <a href="calendar.html?date=${currentDate}">Calendar</a>
            </nav>
            <div class="auth-buttons header-logged-out">
                <a href="login.html?date=${currentDate}" class="login-button">Login</a>
                <a href="join.html?date=${currentDate}" class="join-button">Join</a>
            </div>
            <div class="auth-buttons header-logged-in" style="display: none;">
                <a href="mypage.html?date=${currentDate}" class="mypage-button">My Page</a>
                <a href="#logout" class="logout-button">Logout</a>
            </div>
        </header>
    `;

    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;

        // 로그인 상태 확인
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        const headerLoggedOut = document.querySelector(".header-logged-out");
        const headerLoggedIn = document.querySelector(".header-logged-in");

        // 로그인 상태에 따라 헤더 전환
        if (isLoggedIn) {
            headerLoggedOut.style.display = "none";
            headerLoggedIn.style.display = "flex";
        } else {
            headerLoggedOut.style.display = "flex";
            headerLoggedIn.style.display = "none";
        }

        // 로그아웃 버튼 처리
        const logoutButton = document.querySelector(".logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", function () {
                // 로컬스토리지 데이터 제거
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                localStorage.removeItem("userData");

                // 페이지를 리디렉션
                window.location.href = `index.html?date=${currentDate}`; // 오늘 날짜 포함
            });
        }
    } else {
        console.error("header-placeholder를 찾을 수 없습니다.");
    }
    
});

document.addEventListener("DOMContentLoaded", () => {
    const diaryButton = document.getElementById("diary-button");
    
    
    const currentDate = getKSTDate();
    diaryButton.href = `diary.html?date=${currentDate}`;

    // 로그인 상태일 때만 미리 체크
    if (localStorage.getItem("isLoggedIn") === "true") {
        checkDiaryExistence();
    }

    diaryButton.addEventListener("click", async (event) => {
        event.preventDefault();
        
        if (!localStorage.getItem("token")) {
            alert("로그인이 필요합니다.");
            window.location.href = "login.html";
            return;
        }
        
        // 일기 존재 여부를 다시 확인하고 이동
        const token = localStorage.getItem("token");
        const currentDate = new Date().toISOString().split("T")[0];
        try {
            const response = await fetch(`http://localhost:8080/diaries/user/date?date=${encodeURIComponent(currentDate)}`, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            
            // 일기가 존재하면 diaryDetail로 이동, 없으면 diary로 이동
            if (data && data.content) {
                window.location.href = `diaryDetail.html?date=${currentDate}`;
            } else {
                window.location.href = "diary.html";
            }
        } catch (error) {
            console.error("일기 확인 중 오류 발생:", error);
            window.location.href = "diary.html"; // 오류 발생 시 diary 페이지로 이동
        }
    });
});

function updateURLWithDate() {
    const today = new URLSearchParams(window.location.search).get("date") || getFormattedDate(); // URL에서 날짜 가져오기
    const currentURL = window.location.href;

    // URL에 날짜가 이미 있으면 변경하지 않음
    if (!currentURL.includes(`date=${today}`)) {
        const newURL = `${currentURL.split('?')[0]}?date=${today}`; // 기존 쿼리 파라미터를 제거하고 새로 추가
        history.replaceState(null, '', newURL);
    }
}
