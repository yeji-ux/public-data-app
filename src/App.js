import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.css';
import star from './bg/star_icon.svg';
import ellipse from './bg/ellipse.svg';
import dot2x2 from './bg/dot_2x2.svg';
import dot3x5 from './bg/dot_3x5.svg';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 프로젝트에 필요한 데이터 객체를 구성한다
const seoul = [
  { siDo: 11, goGun: 680, name: '강남구' },
  { siDo: 11, goGun: 740, name: '강동구' },
  { siDo: 11, goGun: 305, name: '강북구' },
  { siDo: 11, goGun: 500, name: '강서구' },
  { siDo: 11, goGun: 530, name: '구로구' },
  { siDo: 11, goGun: 110, name: '종로구' }
]

const incheon = [
  { siDo: 28, goGun: 245, name: '계양구' },
  { siDo: 28, goGun: 170, name: '미추홀구' },
  { siDo: 28, goGun: 237, name: '부평구' },
  { siDo: 28, goGun: 185, name: '연수구' },
  { siDo: 28, goGun: 720, name: '옹진군' },
  { siDo: 28, goGun: 110, name: '중구' }
];

const years = [2021, 2020, 2019, 2018];

// 서버에 데이터를 요청하는 함수
function fetchData(city, year) {

  const endPoint = 'https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle'
  const serviceKey = 'vTwgoOctdPqr40iehJSAY9GLkHT1cZtua%2FrKDIKtxz%2Bo4AbQyMpyJzu587fXBkC98zsEoTjOhUrhToAjMhk%2BBw%3D%3D';
  const type = 'json';
  const numOfRows = 10;
  const pageNo = 1;

  // 자바스크립트에 내장된 fetch() 메서드를 사용하여 서버에 요청한다
  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      // 서버의 응답코드(status)가 200(성공)이 아닌 경우 catch 블록에 응답 객체를 던진다
      if (!res.ok) {
        throw res;
      }
      // 서버의 응답코드가 200인 경우 응답객체(프로미스 객체)를 리턴한다
      return res.json();
    })
  return promise;
}

// 메인 컴포넌트 
export default function App() {
  const [year, setYear] = useState(years[0]);
  const [city, setCity] = useState(seoul[0]);
  const [selectedCity, setSelectedCity] = useState(seoul[0]);

  const handleCitySelect = (city) => {
    if (selectedCity === city) {
      setSelectedCity(null);
    } else {
      setSelectedCity(city);
    }
  };

  // 토글
  const [isYearListOpen, setIsYearListOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const yearRef = useRef();

  const toggleYearList = () => {
    setIsYearListOpen(!isYearListOpen);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearListOpen(false);
  };

  const handleClickOutside = (event) => {
    if (yearRef.current && !yearRef.current.contains(event.target)) {
      setIsYearListOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <div id="wrap">
        {/* header / nav */}
        <header>
          <span>서울특별시·인천광역시</span>
          <h2>자전거 사고 통계</h2>
        </header>

        {/* 메인 */}
        <main>
          <nav>
            <section id="filter">
              <div className="filter_wrap">
                <h3 className="filter_tit">서울</h3>
                {seoul.map((city, index) => (
                  <button
                    key={index}
                    className={`city_filter ${selectedCity === city ? 'active' : ''}`}
                    onClick={() => { handleCitySelect(city); setCity(city); }
                    }
                  >
                    {city.name}
                  </button>
                ))}
              </div>
              <div className="filter_wrap">
                <h3 id="incheon_tit" className="filter_tit">인천</h3>
                {incheon.map((city, index) => (
                  <button
                    key={index}
                    className={`city_filter ${selectedCity === city ? 'active' : ''}`}
                    onClick={() => { handleCitySelect(city); setCity(city); }
                    }
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </section>
            <div id="select_year">
              <button
                id="year_btn"
                onClick={toggleYearList}
              >
                {selectedYear || `${year}`}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
                </svg>
              </button>
              <ul id="year_list" ref={yearRef} className={isYearListOpen ? 'active' : ''}>
                {years.map((year) => (
                  <li key={year} value={year} onClick={(e) => {handleYearSelect(e.target.getAttribute('value')); setYear(year);}}>
                    {year}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* 대시보드에 city와 year변수를 전달한다 */}
          <Dashboard city={city} year={year} />
          <footer>
            도로교통공단에서 제공한 2018 ~ 2021년도까지의 통계자료를 바탕으로 제작되었습니다.
          </footer>
        </main>
      </div>
      <ul id="bg">
        <li id="bg_top">
          <ul id="star_list">
            <li>
              <img src={star} className="star_icon" alt="star shape icon" />
            </li>
            <li>
              <img src={star} className="star_icon" alt="star shape icon" />
            </li>
            <li>
              <span id="star_line"></span>
            </li>
          </ul>
          <img src={dot2x2} className="dot" id="dot_2x2" alt="dot shape icon" />
        </li>
        <li id="bg_bottom">
          <img src={dot3x5} className="dot" id="dot_3x5" alt="dot shape icon" />
          <ul id="ellipse_list">
            <li id="up">
              <img src={ellipse} className="ellipse" alt="ellipse shape icon" />
            </li>
            <li id="middle">
              <img src={ellipse} className="ellipse" alt="ellipse shape icon" />
            </li>
            <li id="down">
              <img src={ellipse} className="ellipse" alt="ellipse shape icon" />
            </li>
          </ul>
        </li>
      </ul>
    </>
  )
}

// 대시보드 
function Dashboard({ city, year }) {

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    // 서버에 요청하기 전 사용자에게 대기 상태를 먼저 보여주어야 한다
    setIsLoaded(false);
    setError(null);

    // fetchData함수에 city와 year 변수를 전달한다
    fetchData(city, year)
      .then(data => {
        setData(data);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true)); // 성공 실패와 관계없이 서버가 응답하면 대기상태를 해제한다

  }, [city, year]) // city 또는 year 변수가 업데이트되면 서버에 다시 데이터를 요청한다

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <>
      <p id="res_text"><b>{year}</b>년도 <b>{city.name}</b> 사고조회 결과</p>
      {data.totalCount > 0 ? (
        <>
          <section id="contents">
            {/* DATA를 합성된 컴포넌트에 전달한다 */}
            <article id="graph_wrap">
              <Rechart accidents={data.items.item} />
            </article>
            <aside>
              <KakaoMap accidents={data.items.item} />
            </aside>
          </section>
        </>
      ) : (
        <div id="no_data_wrap">
          <p id="no_data">
            자료가 없습니다.<br />
            다른 <b>연도</b>나 <b>지역</b>을 선택해주세요.
          </p>
        </div>
      )}
    </>
  )
}

// 리차트 (리액트 차트 라이브러리)
function Rechart({ accidents }) {

  console.log(accidents); // 데이터가 전달되었는지 확인 후 아래 코드를 작성하세요

  // 리차트가 요구하는 형식에 맞게 데이터를 구성한다
  const chartData = accidents.map(accident => {
    return {
      name: accident.spot_nm.split(' ')[2],
      발생건수: accident.occrrnc_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <div id="chart" style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="발생건수" fill="#82ca9d" />
          <Bar dataKey="중상자수" fill="#8884d8" />
          <Bar dataKey="사망자수" fill="#ff4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 카카오 지도 
function KakaoMap({ accidents }) {
  const accident = accidents[0];
  console.log(accidents) // 데이터가 전달되었는지 확인 후 아래 코드를 작성하세요

  return (
    <Map id="map"
      center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }} level={3}
      style={{ width: "100%", height: "calc(40vh + 4rem)" }}
    >
      <MapMarker
        position={{
          lat: accidents[0].la_crd,
          lng: accidents[0].lo_crd,
        }}
        clickable={true}>
        <div style={{ padding: "5px", color: "#000" }}>
          {accident.sido_sgg_nm.substr(0, accident.sido_sgg_nm.length - 1)}
        </div>
      </MapMarker>
    </Map>
  )
}