// 감정 매핑 객체
const emotionMapping = {
  1: '행복',
  2: '분노',
  3: '공포',
  4: '슬픔',
  5: '놀람',
  6: '사랑'
};


document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");

  const diaryDateElement = document.getElementById("detail-date");
  const diaryContentElement = document.getElementById("diary-content");

  if (!date) {
      alert("날짜 정보가 없습니다.");
      window.location.href = "diary.html";
      return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";
      return;
  }

  // 일기 내용 가져오기
  fetch(`http://localhost:8080/diaries/user/date?date=${encodeURIComponent(date)}`, {
      method: "GET",
      headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
      },
  })
  .then(response => {
      console.log("일기 응답 상태 코드:", response.status);
      return response.json();
  })
  .then(data => {
      console.log("일기 API 응답 데이터:", data);
      if (data && data.content) {
          diaryDateElement.textContent = `날짜: ${date}`;
          diaryContentElement.textContent = data.content;
          
          // 감정 분석 결과 가져오기
          return fetch(`http://localhost:8080/emotion/result?date=${encodeURIComponent(date)}`, {
              headers: {
                  "Authorization": `${token}`,
                  "Content-Type": "application/json"
              }
          });
      } else {
          diaryContentElement.textContent = "해당 날짜의 일기가 없습니다.";
          throw new Error("일기가 없습니다.");
      }
  })
  .then(response => response.json())
  .then(emotionData => {
      console.log("감정 분석 데이터:", emotionData);
      displayEmotionResult(emotionData);
  })
  .catch(error => {
      console.error("데이터 로딩 중 오류 발생:", error.message);
      if (error.message !== "일기가 없습니다.") {
          alert(date + " 데이터를 불러오지 못했습니다.");
      }
  });
});

// 감정 분석 결과를 화면에 표시하는 함수
function displayEmotionResult(emotionData) {
  const emotionContainer = document.getElementById("emotion-result");
  if (emotionContainer && emotionData) {
      let emotionHtml = '<h3></h3>';
      
      emotionData.forEach(item => {
          const percentage = (item.per * 100).toFixed(1);
          const koreanEmotion = emotionMapping[item.emotionId] || '알 수 없음';
          
          emotionHtml += `
              <h3>${koreanEmotion}: ${percentage}%</h3>
          `;
      });
      
      emotionContainer.innerHTML = emotionHtml;
  }
}







// 수정 버튼 클릭 처리
document.querySelector(".edit-button").addEventListener("click", () => {
    console.log("수정 버튼 클릭됨"); // 클릭 이벤트 확인
    const params = new URLSearchParams(window.location.search);
    const date = params.get("date"); // URL에서 날짜를 가져옵니다.

    if (date) {
        const token = localStorage.getItem("token"); // 토큰을 로컬 스토리지에서 가져옵니다.
        
        // 일기 데이터 API 호출
        fetch(`http://localhost:8080/diaries/user/date?date=${encodeURIComponent(date)}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
          console.log("일기 응답 상태 코드:", response.status);
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다.');
            }
            return response.json();
        })
        .then(data => {
            console.log("일기 API 응답 데이터:", data);
            // 일기 데이터를 불러와서 수정 페이지로 이동
            if (typeof data.content === 'string') {
                window.location.href = `diaryEdit.html?date=${encodeURIComponent(date)}&content=${encodeURIComponent(data.content)}`; // 수정 페이지로 이동
            } else {
                alert("일기 내용이 유효하지 않습니다.");
            }
        })
        .catch(error => {
            console.error('API 호출 중 오류 발생:', error);
            alert("일기 데이터를 불러오는 데 실패했습니다.");
        });
    } else {
        alert("날짜 정보가 없습니다."); // 날짜가 없을 경우 경고
    }
});






// 삭제 버튼 클릭 처리
document.querySelector(".delete-button").addEventListener("click", () => {
  const params = new URLSearchParams(window.location.search);
  /* const diaryId = params.get("id"); */
  const date = params.get("date");
/* 
  if (!diaryId) {
      alert(diaryId+"잘못된 접근입니다.");
      window.location.href = "diary.html";
      return;
  }
 */
  const token = localStorage.getItem("token");
  if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";
      return;
  }

  const confirmDelete = confirm("정말로 이 일기를 삭제하시겠습까?");
  if (confirmDelete) {
      fetch(`http://localhost:8080/diaries/delete?date=${encodeURIComponent(date)}`, {
          method: "DELETE",
          headers: {
              "Authorization": `${token}`,
              "Content-Type": "application/json",
          },
      })
          .then(response => {
              if (response.ok) {
                  alert("일기가 삭제되었습니다.");
                  window.location.href = "diary.html";
              } else {
                  throw new Error("일기 삭제 실패");
              }
          })
          .catch(error => {
              console.error("일기 삭제 중 오류 발생:", error.message);
              alert("일기를 삭제하지 못했습니다.");
          });
  }
});





// 감정 분석 결과를 표시하는 함수
function displayEmotionResults(emotionData) {
  const analysisResult = document.getElementById("analysis-result");
  analysisResult.innerHTML = ""; // 기존 내용을 지웁니다.

  emotionData.forEach(emotion => {
      const listItem = document.createElement("li");
      // 감정 ID를 감정 이름으로 변환
      const emotionName = emotionMapping[emotion.emotionId] || '알 수 없음';
      listItem.textContent = `감정: ${emotionName}, 비율: ${emotion.per}`;
      analysisResult.appendChild(listItem);
  });
}






// API 호출 후 결과를 표시하는 예시
fetch(`http://localhost:8080/emotionper?date=${encodeURIComponent(date)}`, {
  method: "GET",
  headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
  },
})
.then(response => response.json())
.then(data => {
  displayEmotionResults(data); // 감정 분석 결과를 표시합니다.
})
.catch(error => {
  console.error("Error:", error);

});