
        const WEATHER_API_KEY = '29c2b524b950dbc23b18ed9c922276b4';
        const NEWS_API_KEY = 'be7c6e11aaf040d19868946a4260acb4';

        let currentCategory = 'general';


        function init() {
            getWeather('Delhi');
            getNews('general');
            

            setInterval(() => {
                getWeather();
                getNews(currentCategory);
            }, 600000);
        }


        async function getWeather(city) {
            const cityName = city || document.getElementById('cityInput').value || 'Delhi';
            
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WEATHER_API_KEY}&units=metric`);
                const data = await response.json();
                
                if (response.ok) {
                    displayWeather(data);
                } else {
                    alert('City not found! Please try again.');
                }
            } catch (error) {
                console.error('Weather API error:', error);
                document.getElementById('temperature').textContent = 'Error loading weather';
            }
        }

        function displayWeather(data) {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°C';
            document.getElementById('weatherDescription').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = data.main.humidity;
            document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
        }

        async function getNews(category) {
            currentCategory = category;
            
            document.querySelectorAll('.nav-categories button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('newsGrid').innerHTML = '';
            
            try {
                const response = await fetch(`https://newsapi.org/v2/everything?q=${category}&pageSize=10&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`);
                const data = await response.json();
                
                if (response.ok) {
                    displayNews(data.articles);
                } else {
                    document.getElementById('loading').textContent = 'Error loading news';
                }
            } catch (error) {
                console.error('News API error:', error);
                document.getElementById('loading').textContent = 'Error loading news';
            }
        }

        async function searchNews() {
            const searchTerm = document.getElementById('searchInput').value;
            if (!searchTerm) return;
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('newsGrid').innerHTML = '';
            
            try {
                const response = await fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&pageSize=10&apiKey=${NEWS_API_KEY}`);
                const data = await response.json();
                
                if (response.ok) {
                    displayNews(data.articles);
                } else {
                    document.getElementById('loading').textContent = 'Error searching news';
                }
            } catch (error) {
                console.error('News search error:', error);
                document.getElementById('loading').textContent = 'Error searching news';
            }
        }

        function displayNews(articles) {
            document.getElementById('loading').style.display = 'none';
            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = '';
            
            articles.forEach(article => {
                if (article.title && article.title !== '[Removed]') {
                    const newsCard = document.createElement('div');
                    newsCard.className = 'news-card';
                    newsCard.onclick = () => window.open(article.url, '_blank');
                    
                    const imageUrl = article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image';
                    const publishedDate = new Date(article.publishedAt).toLocaleDateString();
                    
                    newsCard.innerHTML = `
                        <img src="${imageUrl}" alt="News Image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        <h3>${article.title}</h3>
                        <p>${article.description || 'No description available'}</p>
                        <div class="news-meta">
                            <span>${article.source.name}</span> • <span>${publishedDate}</span>
                        </div>
                    `;
                    
                    newsGrid.appendChild(newsCard);
                }
            });
        }

        document.getElementById('cityInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getWeather();
            }
        });

        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchNews();
            }
        });
        window.onload = init;