document.addEventListener("DOMContentLoaded", async () => {
    // 사용자 정보 및 감정 통계 가져오기 (임시 또는 API 호출)
    const userToken = localStorage.getItem("token"); // 사용자 토큰 가져오기
    let userName = "사용자"; // 기본 사용자 이름

    // 사용자 이름 API 호출
    try {
        const response = await fetch("http://localhost:8080/user/username", {
            method: "GET",
            headers: {
                "Authorization": `${userToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("사용자 이름을 가져오는 데 실패했습니다.");
        }

        userName = await response.text(); // 사용자 이름 가져오기
    } catch (error) {
        console.error("사용자 이름을 가져오는 중 오류 발생:", error);
    }

    // 사용자 이름 설정
    document.getElementById("user-name").textContent = userName;
    document.getElementById("user-name-recommendation").textContent = userName;

    // 월별 통계 API 호출
    const year = new Date().getFullYear(); // 현재 연도
    const month = new Date().getMonth() + 1; // 현재 월 (0부터 시작하므로 +1)

    let emotionData = {
        행복: 0,
        분노: 0,
        공포: 0,
        슬픔: 0,
        사랑: 0,
        놀람: 0
    }; // 감정 데이터 초기화

    try {
        const response = await fetch(`http://localhost:8080/statistics/monthly?year=${year}&month=${month}`, {
            method: "GET",
            headers: {
                "Authorization": `${userToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("통계 데이터를 가져오는 데 실패했습니다.");
        }

        const data = await response.json();
        emotionData = {
            행복: data.statistics.joy || 0,
            사랑: data.statistics.love || 0,
            놀람: data.statistics.surprise || 0,
            슬픔: data.statistics.sadness || 0,
            분노: data.statistics.anger || 0,
            공포: data.statistics.fear || 0
        };
    } catch (error) {
        console.error("통계 데이터를 가져오는 중 오류 발생:", error);
    }

    console.log(emotionData);

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
                backgroundColor: ["#ffeb3b", "#ff5722", "#2196f3", "#4caf50", "#ff4081", "#9c27b0"],
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

    // 감정 ID와 이름 매핑
    const emotionMap = {
        1: "joy",
        2: "anger",
        3: "fear",
        4: "sadness",
        5: "love",
        6: "surprise"
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
                        dateElement.textContent = `날짜: ${item.date}, 비율: ${item.highestPercentage}`;
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
        option.value = emotion;
        option.textContent = emotion;
        emotionSelect.appendChild(option);
    });

    // 감정 선택 시 이벤트 처리
    emotionSelect.addEventListener("change", (event) => {
        const selectedEmotion = event.target.value;
        fetchTopEmotionDate(selectedEmotion);
    });

    // 초기 데이터 로드: 주요 감정을 기본으로 표시
    emotionSummary.textContent = "감정을 선택해주세요.";

    //==========================추천활동==================================

    
});



