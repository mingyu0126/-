export function isTokenExpired(token) {
    if (!token) return true;
    
    try {
        // 토큰 형식 검증
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('잘못된 토큰 형식');
            return true;
        }

        const payload = JSON.parse(atob(parts[1]));
        const expirationTime = payload.exp * 1000;
        return Date.now() >= expirationTime;
    } catch (error) {
        console.error('토큰 검증 중 오류:', error);
        return true;
    }
}

const token = localStorage.getItem("token");
if (isTokenExpired(token)) {
    alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}