// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         // 사용자 정보 및 감정 통계 가져오기 (임시 또는 API 호출)
//         const userName = localStorage.getItem("username") || "사용자";
//         const emotionDataJSON = localStorage.getItem("emotionData") || JSON.stringify({
//             행복: 40,
//             불안: 20,
//             슬픔: 25,
//             화남: 15
//         });

//         const emotionData = JSON.parse(emotionDataJSON);

//         // 감정별 주요 일기 날짜 (임시 데이터)
//         const emotionDiaryDates = {
//             행복: ["2023-11-20", "2023-11-21"],
//             불안: ["2023-11-18"],
//             슬픔: ["2023-11-19"],
//             화남: []
//         };

//         // 사용자 이름 설정
//         document.getElementById("user-name").textContent = userName;
//         document.getElementById("user-name-recommendation").textContent = userName;

//         // 주요 감정 계산 및 설정
//         const mainEmotion = Object.keys(emotionData).reduce((a, b) =>
//             emotionData[a] > emotionData[b] ? a : b
//         );
//         document.getElementById("main-emotion").textContent = mainEmotion;

//         // 감정 차트 생성 (Chart.js 라이브러리 사용)
//         const ctx = document.getElementById("emotion-chart").getContext("2d");
//         new Chart(ctx, {
//             type: "pie",
//             data: {
//                 labels: Object.keys(emotionData),
//                 datasets: [{
//                     data: Object.values(emotionData),
//                     backgroundColor: ["#ffeb3b", "#ff5722", "#2196f3", "#4caf50"],
//                 }],
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: "bottom",
//                     },
//                 },
//             },
//         });

//         // // 감정 선택 드롭다운 동적 생성
//         // const emotionSelect = document.getElementById("emotion-select");
//         // Object.keys(emotionData).forEach((emotion) => {
//         //     const option = document.createElement("option");
//         //     option.value = emotion;
//         //     option.textContent = emotion;
//         //     emotionSelect.appendChild(option);
//         // });

//         // // 감정 선택 이벤트 핸들러
//         // emotionSelect.addEventListener("change", (event) => {
//         //     const selectedEmotion = event.target.value;
//         //     const datesContainer = document.getElementById("emotion-dates");
//         //     datesContainer.innerHTML = ""; // 기존 날짜 목록 초기화

//         //     // 선택한 감정의 날짜 표시
//         //     if (emotionDiaryDates[selectedEmotion] && emotionDiaryDates[selectedEmotion].length > 0) {
//         //         emotionDiaryDates[selectedEmotion].forEach((date) => {
//         //             const dateElement = document.createElement("a");
//         //             dateElement.href = `diaryDetail.html?date=${date}`;
//         //             dateElement.textContent = date;
//         //             dateElement.classList.add("date-link");
//         //             datesContainer.appendChild(dateElement);
//         //         });
//         //     } else {
//         //         datesContainer.textContent = "해당 감정의 일기가 없습니다.";
//         //     }
//         // });
//     } catch (error) {
//         console.error("데이터를 가져오는 중 오류 발생:", error);
//         alert("데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
//     }
// });
document.addEventListener("DOMContentLoaded", () => {
     // 사용자 정보 및 감정 통계 가져오기 (임시 또는 API 호출)
        const userName = localStorage.getItem("username") || "사용자";
        const emotionDataJSON = localStorage.getItem("emotionData") || JSON.stringify({
            행복: 40,
            불안: 20,
            슬픔: 25,
            화남: 15
        });

        const emotionData = JSON.parse(emotionDataJSON);

        // 감정별 주요 일기 날짜 (임시 데이터)
        const emotionDiaryDates = {
            행복: ["2023-11-20", "2023-11-21"],
            불안: ["2023-11-18"],
            슬픔: ["2023-11-19"],
            화남: []
        };

        // 사용자 이름 설정
        document.getElementById("user-name").textContent = userName;
        document.getElementById("user-name-recommendation").textContent = userName;

        // 주요 감정 계산 및 설정
        const mainEmotion = Object.keys(emotionData).reduce((a, b) =>
            emotionData[a] > emotionData[b] ? a : b
        );
        document.getElementById("main-emotion").textContent = mainEmotion;

        // 감정 차트 생성 (Chart.js 라이브러리 사용)
        const ctx = document.getElementById("emotion-chart").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(emotionData),
                datasets: [{
                    data: Object.values(emotionData),
                    backgroundColor: ["#ffeb3b", "#ff5722", "#2196f3", "#4caf50"],
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        });
//=========================================


    const emotionSummary = document.getElementById("main-emotion");
    const emotionSelect = document.getElementById("emotion-select");
    const emotionDatesContainer = document.getElementById("emotion-dates");

    // 사용자 토큰
    const userToken = localStorage.getItem("token");

    // 감정 ID와 이름 매핑
    const emotionMap = {
        1: { name: "행복", english: "joy" },
        2: { name: "분노", english: "anger" },
        3: { name: "공포", english: "fear" },
        4: { name: "슬픔", english: "sadness" },
        5: { name: "사랑", english: "love" },
        6: { name: "놀람", english: "surprise" },
        
    };

    // 감정별 최고 비율 날짜 데이터를 가져오는 함수
    function fetchTopEmotionDate(emotionType) {
        fetch(`http://localhost:8080/api/emotion-search/top-dates?emotionType=${emotionType}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((errorMessage) => {
                        throw new Error(errorMessage || "알 수 없는 오류가 발생했습니다.");
                    });
                }
                return response.json();
            })
            .then((data) => {
                // 기존 데이터를 초기화
                emotionDatesContainer.innerHTML = "";

                // 데이터가 있을 경우, 최고 비율 날짜 출력
                if (data.length > 0) {
                    data.forEach((item) => {
                        const dateElement = document.createElement("p");
                        const percentage = (item.highestPercentage*100).toFixed(0);
                        dateElement.textContent = `날짜: ${item.date}, 비율: ${percentage}`;
                        emotionDatesContainer.appendChild(dateElement);
                    });
                } else {
                    emotionDatesContainer.textContent = "데이터 없음";
                }
            })
            .catch((error) => {
                console.error("Error fetching emotion dates:", error);
                emotionDatesContainer.textContent = error.message;
            });
    }

    // 감정 선택 드롭다운에 옵션 추가
    Object.entries(emotionMap).forEach(([id, emotion]) => {
        const option = document.createElement("option");
        option.value = emotion.english;
        option.textContent = emotion.name;
        emotionSelect.appendChild(option);
    });

    // 감정 선택 시 이벤트 처리
    emotionSelect.addEventListener("change", (event) => {
        const selectedEmotion = event.target.value;
        fetchTopEmotionDate(selectedEmotion);
    });

    // 초기 데이터 로드: 주요 감정을 기본으로 표시
    emotionSummary.textContent = "감정을 선택해주세요.";
});

document.addEventListener("DOMContentLoaded", () => {
    const userNameRecommendation = document.getElementById("user-name-recommendation");
    const name1 = document.getElementById("name1");
    const description1 = document.getElementById("description1");
    const name2 = document.getElementById("name2");
    const description2 = document.getElementById("description2");
    const name3 = document.getElementById("name3");
    const description3 = document.getElementById("description3");

    

    // 사용자 토큰
    const userToken = localStorage.getItem("token");

    const apiUrlRecommended = "http://localhost:8080/api/recommended-activity/diary/date";

    // 오늘 날짜를 "YYYY-MM-DD" 형식으로 가져오는 함수
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const date = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

    // 추천 활동 데이터를 가져오는 함수
    function fetchRecommendedActivities(date) {
        fetch(`${apiUrlRecommended}?date=${date}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("일기를 먼저 작성해주세요!!");
                    } else {
                        throw new Error(`추천 활동 데이터를 가져오는 데 실패했습니다. 상태 코드: ${response.status}`);
                    }
                }
                return response.json();
            })
            .then((data) => {
                // 추천 활동 표시
                if (data.length > 0) {
                    name1.textContent = data[0]["해보아요!!"] || "";
                    description1.textContent = data[0]["이렇게!!"] || "";

                    name2.textContent = data[1]?.["해보아요!!"] || "";
                    description2.textContent = data[1]?.["이렇게!!"] || "";

                    name3.textContent = data[2]?.["해보아요!!"] || "";
                    description3.textContent = data[2]?.["이렇게!!"] || "";
                } else {
                    name1.textContent = "";
                    description1.textContent = "추천 활동이 없습니다.";
                    name2.textContent = "";
                    description2.textContent = "";
                    name3.textContent = "";
                    description3.textContent = "";
                }
            })
            .catch((error) => {
                console.error("Error fetching recommended activities:", error);
                name1.textContent = "";
                description1.textContent = error.message;
                name2.textContent = "";
                description2.textContent = "";
                name3.textContent = "";
                description3.textContent = "";
            });
    }

    // 초기 설정
    const todayDate = getTodayDate(); // 오늘 날짜 가져오기
    userNameRecommendation.textContent = localStorage.getItem("userName") || "사용자"; // 사용자 이름 설정
    fetchRecommendedActivities(todayDate); // 오늘 날짜로 추천 활동 데이터 로드
});




