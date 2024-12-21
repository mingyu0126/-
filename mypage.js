import { isTokenExpired } from './authUtils.js';
document.addEventListener("DOMContentLoaded", async () => {
  console.log("페이지 로드됨");
  
  const userNameElement = document.getElementById("user-name");
  const deleteAccountButton = document.getElementById("delete-account");
  const diaryCountElement = document.getElementById("diary-count");
  const latestdiarydate=document.getElementById("late-diary-date");
  
  console.log("DOM 요소들:", {
    userNameElement,
    deleteAccountButton,
    diaryCountElement
  });
  
  const token = localStorage.getItem("token");
  console.log("토큰:", token);
  
  if (!token || isTokenExpired(token)) {
    console.log("토큰 없음 또는 만료됨");
    alert("로그인이 필요하거나 토큰이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  // 서버에서 사용자 이름 가져오기
  fetch("http://localhost:8080/user/username", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      if (response.ok) {
        return response.text(); // 서버에서 사용자 이름만 반환
      } else if (response.status === 401) {
        throw new Error("로그인이 필요합니다.");
      } else {
        throw new Error("사용자 정보를 가져오지 못했습니다.");
      }
    })
    .then(userName => {
      // 사용자 이름 표시
      userNameElement.textContent = `${userName}`;
    })
    .catch(error => {
      console.error("사용자 데이터 로드 오류:", error);
      alert(error.message);
      // 로그인 페이지로 리디렉션
      window.location.href = "login.html";
    });

  if (deleteAccountButton) {
    deleteAccountButton.addEventListener("click", () => {
      // 사용자 확인 (경고창)
      const confirmDelete = confirm("정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
      if (!confirmDelete) {
        return;
      }

      // 회원 탈퇴 API 호출
      fetch("http://localhost:8080/user/delete", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          if (response.ok) {
            alert("계정이 성공적으로 삭제되었습니다.");
            
            // 로컬 스토리지 초기화
            localStorage.removeItem("token");
            localStorage.removeItem("user_name");
            localStorage.setItem("isLoggedIn", "false");
            
            // 로그인 페이지로 리디렉션
            window.location.href = "login.html";
          } else {
            throw new Error("계정 삭제 실패: 서버 에러");
          }
        })
        .catch(error => {
          console.error("계정 삭제 요청 중 에러 발생:", error);
          alert("계정을 삭제하지 못했습니다. 다시 시도해주세요.");
        });
    });
  } else {
    console.error("delete-account 버튼을 찾을 수 없습니다.");
  }

  // 작성한 일기 수 가져오기
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("토큰이 없습니다");
    }

    console.log("API 요청 시작"); // 디버깅용
    const countResponse = await fetch("http://localhost:8080/diaries/user/count", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    
    console.log("응답 상태:", countResponse.status); // 디버깅용
    
    if (countResponse.ok) {
      const count = await countResponse.json();
      document.getElementById("diary-count").textContent = count;
    } else {
      console.error("서버 응답 에러:", countResponse.status);
      throw new Error(`서버 에러: ${countResponse.status}`);
    }
  } catch (error) {
    console.error("일기 수 조회 중 오류:", error);
    document.getElementById("diary-count").textContent = "조회 실패";
  }

  // 최근 일기 작성일 조회
  try {
    console.log("최근 일기 날짜 API 요청 시작");
    const latestResponse = await fetch("http://localhost:8080/diaries/latest", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (latestResponse.ok) {
      const latestDate = await latestResponse.json();
      console.log("받은 날짜 데이터:", latestDate);
      
      if (latestDate) {
        // 날짜 포맷팅
        const date = new Date(latestDate);
        const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
        document.getElementById("late-diary-date").textContent = `${formattedDate}`;
      } else {
        // null인 경우 처리
        document.getElementById("late-diary-date").textContent = "작성된 일기가 없습니다";
      }
    } else if (latestResponse.status === 401) {
      document.getElementById("late-diary-date").textContent = "인증이 필요합니다";
    } else {
      document.getElementById("late-diary-date").textContent = "조회 실패";
    }
  } catch (error) {
    console.error("최근 일기 날짜 조회 중 오류:", error);
    // null 체크를 포함한 안전한 에러 처리
    const lateDiaryDateElement = document.getElementById("late-diary-date");
    if (lateDiaryDateElement) {
      lateDiaryDateElement.textContent = "조회 실패";
    }
  }
});