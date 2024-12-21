document.addEventListener("DOMContentLoaded", function () {
    const headerHTML = `
        <header class="header">
            <div class="logo">
                <a href="index.html">
                    <img src="복사본.png" alt="FeelLog">
                </a>
            </div>
            <nav class="nav-menu">
                <a id="diary-button" href="diary.html">Diary</a>
                <a href="eqPage.html">EQ 높이기</a>
                <a href="calendar.html">Calendar</a>
            </nav>
            <div class="auth-buttons header-logged-out">
                <a href="login.html" class="login-button">Login</a>
                <a href="join.html" class="join-button">Join</a>
            </div>
            <div class="auth-buttons header-logged-in" style="display: none;">
                <a href="mypage.html" class="mypage-button">My Page</a>
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
                window.location.href = "index.html";
            });
        }
    } else {
        console.error("header-placeholder를 찾을 수 없습니다.");
    }
});

// 공통 로직: 일기 확인 후 페이지 이동
async function checkDiaryAndNavigate(event) {
    event.preventDefault(); // 기본 동작 방지

    const token = localStorage.getItem("token");
    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
        return;
    }

    const currentDate = new Date().toISOString().split("T")[0];

    try {
        const response = await fetch(`http://localhost:8080/diaries/user/date?date=${encodeURIComponent(currentDate)}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("서버 응답 실패");
        }

        const data = await response.json();
        console.log("API 응답 데이터:", data);

        if (data && data.content) {
            window.location.href = `diaryDetail.html?date=${currentDate}`;
        } else {
            window.location.href = "diary.html";
        }
    } catch (error) {
        console.error("일기 확인 중 오류 발생:", error.message);
        window.location.href = "diary.html"; // 오류 발생 시 diary 페이지로 이동
    }
}

// Diary 버튼과 Write Diary 버튼 동작 설정
document.addEventListener("DOMContentLoaded", () => {
    const diaryButton = document.getElementById("diary-button");
    const writeDiaryButton = document.getElementById("write-diary-button");

    if (diaryButton) {
        diaryButton.addEventListener("click", checkDiaryAndNavigate);
    }

    if (writeDiaryButton) {
        writeDiaryButton.addEventListener("click", checkDiaryAndNavigate);
    }
});
