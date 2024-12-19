document.addEventListener("DOMContentLoaded", () => {
    const joinForm = document.getElementById("join-form");
  
    joinForm.addEventListener("submit", (event) => {
      event.preventDefault(); // 폼 기본 동작 방지
  
      // 입력값 가져오기
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (username && email && password) {
        // 사용자 데이터 생성
        const userData = {
          name: username,
          email: email,
          password: password, // 암호는 실제로는 백엔드에서만 관리해야 합니다.
          joinDate: new Date().toISOString().split("T")[0], // 가입일 저장
          diaryCount: 0,
          lastDiaryDate: "-", // 초기값
        };
  
        // LocalStorage에 저장
        localStorage.setItem("userData", JSON.stringify(userData));
  
        // 회원가입 성공 메시지
        alert("회원가입이 완료되었습니다!");
        window.location.href = "mypage.html"; // 마이페이지로 이동
      } else {
        alert("모든 필드를 입력해 주세요.");
      }
    });
  });
  