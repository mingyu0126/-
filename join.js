document.addEventListener("DOMContentLoaded", () => {
  const joinForm = document.getElementById("join-form");

  if (joinForm) {
      joinForm.addEventListener("submit", (event) => {
          event.preventDefault(); // 폼 기본 동작 방지

          // 입력값 가져오기
          const username = document.getElementById("username").value.trim();
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value.trim();

          fetch('http://localhost:8080/user/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  user_name: username,
                  user_id: email,
                  password: password,
              }),
          })
          .then(response => {
              if (response.ok) {
                  return response.text(); // 서버에서 토큰을 단순 문자열로 반환
              } else if (response.status === 409) {
                  throw new Error("중복된 사용자입니다!");
              } else {
                  throw new Error("회원가입 실패!");
              }
          })
          .then(token => {
              // 토큰 저장
              localStorage.setItem("token", token);
              localStorage.setItem("isLoggedIn", "true");

              alert("회원가입 완료!");
              window.location.href = "index.html";
          })
          .catch(error => {
              console.error("요청 에러 발생:", error.message);
              alert(error.message);
          });
      });
  } else {
      console.error("join-form을 찾을 수 없습니다.");
  }
});