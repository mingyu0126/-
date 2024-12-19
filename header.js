document.addEventListener("DOMContentLoaded", function () {
    const headerHTML = `
        <header class="header">
            <div class="logo">
                <a href="index.html">
                    <img src="복사본.png" alt="FeelLog">
                </a>
            </div>
            <nav class="nav-menu">
                <a href="diary.html">Diary</a>
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
                localStorage.setItem("isLoggedIn", "false");
                window.location.href = "index.html";
            });
        }
    } else {
        console.error("header-placeholder를 찾을 수 없습니다.");
    }
    
});
