export function CityBackground() {
  return (
    <div className="city-bg">
      {/* Sky */}
      <div className="sky" />

      {/* Sun with rays */}
      <div className="sun-wrapper">
        <div className="sun-rays" />
        <div className="sun" />
      </div>

      {/* Clouds */}
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />

      {/* Birds */}
      <div className="birds">
        <div className="bird bird-1" />
        <div className="bird bird-2" />
        <div className="bird bird-3" />
      </div>

      {/* ======= FAR SKYLINE ======= */}
      <svg className="skyline skyline-far" viewBox="0 0 1920 400" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="farGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ba4c4" />
            <stop offset="100%" stopColor="#6d8bb0" />
          </linearGradient>
        </defs>
        <path d="M0,400 L0,220 L60,220 L60,160 L80,160 L80,140 L100,140 L100,160 L120,160 L120,200 L160,200 L160,170 L180,170 L180,120 L190,100 L200,120 L200,170 L240,170 L240,200 L280,200 L280,180 L300,180 L300,130 L310,110 L320,130 L320,180 L360,180 L360,150 L380,150 L380,190 L420,190 L420,160 L440,160 L440,100 L460,100 L460,80 L470,60 L480,80 L480,100 L500,100 L500,160 L540,160 L540,200 L580,200 L580,170 L600,170 L600,140 L620,140 L620,170 L660,170 L660,190 L700,190 L700,150 L720,150 L720,90 L735,70 L750,90 L750,150 L780,150 L780,180 L820,180 L820,160 L840,160 L840,120 L860,120 L860,160 L900,160 L900,200 L940,200 L940,170 L960,170 L960,130 L980,130 L980,110 L990,90 L1000,110 L1000,130 L1020,130 L1020,170 L1060,170 L1060,190 L1100,190 L1100,160 L1120,160 L1120,140 L1140,140 L1140,180 L1180,180 L1180,200 L1220,200 L1220,170 L1240,170 L1240,110 L1255,85 L1270,110 L1270,170 L1300,170 L1300,190 L1340,190 L1340,160 L1360,160 L1360,180 L1400,180 L1400,200 L1440,200 L1440,170 L1460,170 L1460,150 L1480,150 L1480,120 L1495,100 L1510,120 L1510,150 L1540,150 L1540,180 L1580,180 L1580,200 L1620,200 L1620,160 L1640,160 L1640,180 L1680,180 L1680,200 L1720,200 L1720,170 L1740,170 L1740,190 L1780,190 L1780,210 L1820,210 L1820,200 L1860,200 L1860,220 L1920,220 L1920,400 Z"
          fill="url(#farGrad)" opacity="0.45" />
      </svg>

      {/* ======= MID SKYLINE ======= */}
      <svg className="skyline skyline-mid" viewBox="0 0 1920 500" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a96b8" />
            <stop offset="60%" stopColor="#5e7da0" />
            <stop offset="100%" stopColor="#4a6a8a" />
          </linearGradient>
          <linearGradient id="glassReflectDay" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(180,210,255,0.25)" />
            <stop offset="50%" stopColor="rgba(140,180,230,0.08)" />
            <stop offset="100%" stopColor="rgba(160,200,250,0.15)" />
          </linearGradient>
        </defs>
        <path d="M0,500 L0,300 L50,300 L50,220 L55,220 L55,200 L58,190 L61,200 L65,200 L65,220 L70,220 L70,260 L110,260 L110,230 L130,230 L130,160 L140,160 L140,140 L145,130 L150,140 L155,140 L155,130 L160,120 L165,130 L170,130 L170,140 L175,140 L175,160 L185,160 L185,230 L220,230 L220,280 L280,280 L280,250 L300,250 L300,180 L310,180 L310,150 L315,140 L320,150 L320,180 L330,180 L330,250 L370,250 L370,300 L430,300 L430,260 L450,260 L450,210 L460,210 L460,170 L465,155 L470,170 L475,170 L475,155 L480,145 L485,155 L490,155 L490,170 L500,170 L500,210 L510,210 L510,260 L550,260 L550,300 L600,300 L600,270 L620,270 L620,220 L630,220 L630,190 L635,180 L640,190 L640,220 L650,220 L650,270 L690,270 L690,290 L740,290 L740,250 L760,250 L760,200 L770,200 L770,170 L775,155 L780,170 L780,200 L790,200 L790,250 L830,250 L830,280 L880,280 L880,240 L900,240 L900,190 L910,190 L910,150 L915,135 L920,150 L925,150 L925,135 L930,125 L935,135 L940,135 L940,150 L950,150 L950,190 L960,190 L960,240 L1000,240 L1000,270 L1050,270 L1050,230 L1070,230 L1070,180 L1080,180 L1080,160 L1085,150 L1090,160 L1095,160 L1095,150 L1100,140 L1105,150 L1110,150 L1110,160 L1120,160 L1120,180 L1130,180 L1130,230 L1170,230 L1170,260 L1220,260 L1220,220 L1240,220 L1240,170 L1250,170 L1250,140 L1255,125 L1260,140 L1265,140 L1265,125 L1270,115 L1275,125 L1280,125 L1280,140 L1290,140 L1290,170 L1300,170 L1300,220 L1340,220 L1340,260 L1400,260 L1400,280 L1460,280 L1460,240 L1480,240 L1480,200 L1490,200 L1490,170 L1495,160 L1500,170 L1505,170 L1505,160 L1510,150 L1515,160 L1520,160 L1520,170 L1530,170 L1530,200 L1540,200 L1540,240 L1580,240 L1580,270 L1640,270 L1640,250 L1660,250 L1660,220 L1670,220 L1670,200 L1675,190 L1680,200 L1685,200 L1685,190 L1690,180 L1695,190 L1700,190 L1700,200 L1710,200 L1710,220 L1720,220 L1720,250 L1760,250 L1760,280 L1820,280 L1820,300 L1880,300 L1880,310 L1920,310 L1920,500 Z"
          fill="url(#midGrad)" />
        {/* Glass panels */}
        <rect x="140" y="160" width="35" height="70" fill="url(#glassReflectDay)" rx="1" />
        <rect x="460" y="170" width="35" height="40" fill="url(#glassReflectDay)" rx="1" />
        <rect x="770" y="170" width="30" height="30" fill="url(#glassReflectDay)" rx="1" />
        <rect x="920" y="150" width="35" height="40" fill="url(#glassReflectDay)" rx="1" />
        <rect x="1260" y="140" width="30" height="30" fill="url(#glassReflectDay)" rx="1" />
        <rect x="1500" y="170" width="30" height="30" fill="url(#glassReflectDay)" rx="1" />
      </svg>

      {/* ======= NEAR SKYLINE ======= */}
      <svg className="skyline skyline-near" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="nearGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a7a9e" />
            <stop offset="50%" stopColor="#486888" />
            <stop offset="100%" stopColor="#3a5672" />
          </linearGradient>
          <linearGradient id="glassShineDay" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="rgba(200,225,255,0.3)" />
            <stop offset="40%" stopColor="rgba(160,200,250,0.08)" />
            <stop offset="100%" stopColor="rgba(180,210,255,0.2)" />
          </linearGradient>
          <linearGradient id="sunBounce" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(255,248,220,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <path d="M0,600 L0,350 L70,350 L70,280 L80,280 L80,230 L90,230 L90,200 L95,185 L100,200 L110,200 L110,230 L120,230 L120,280 L130,280 L130,320 L180,320 L180,300 L200,300 L200,240 L210,240 L210,190 L215,175 L220,190 L230,190 L230,175 L235,160 L240,175 L250,175 L250,190 L260,190 L260,240 L270,240 L270,300 L320,300 L320,340 L400,340 L400,310 L420,310 L420,260 L430,260 L430,220 L435,210 L440,220 L445,220 L445,210 L450,200 L455,210 L460,210 L460,220 L470,220 L470,260 L480,260 L480,310 L530,310 L530,350 L600,350 L600,320 L620,320 L620,270 L630,270 L630,230 L635,215 L640,230 L650,230 L650,270 L660,270 L660,320 L720,320 L720,340 L790,340 L790,300 L810,300 L810,250 L820,250 L820,210 L825,195 L830,210 L840,210 L840,250 L850,250 L850,300 L900,300 L900,330 L960,330 L960,290 L980,290 L980,240 L990,240 L990,200 L995,185 L1000,200 L1010,200 L1010,240 L1020,240 L1020,290 L1070,290 L1070,320 L1140,320 L1140,280 L1160,280 L1160,230 L1170,230 L1170,180 L1175,165 L1180,180 L1190,180 L1190,165 L1195,150 L1200,165 L1210,165 L1210,180 L1220,180 L1220,230 L1230,230 L1230,280 L1290,280 L1290,310 L1360,310 L1360,270 L1380,270 L1380,220 L1390,220 L1390,190 L1395,180 L1400,190 L1405,190 L1405,180 L1410,170 L1415,180 L1420,180 L1420,190 L1430,190 L1430,220 L1440,220 L1440,270 L1500,270 L1500,300 L1560,300 L1560,330 L1630,330 L1630,290 L1650,290 L1650,250 L1660,250 L1660,220 L1665,210 L1670,220 L1680,220 L1680,250 L1690,250 L1690,290 L1750,290 L1750,320 L1820,320 L1820,340 L1920,340 L1920,600 Z"
          fill="url(#nearGrad)" />

        {/* Glass facades */}
        <rect x="80" y="200" width="30" height="30" fill="url(#glassShineDay)" rx="1" />
        <rect x="210" y="190" width="50" height="50" fill="url(#glassShineDay)" rx="1" />
        <rect x="430" y="220" width="40" height="40" fill="url(#glassShineDay)" rx="1" />
        <rect x="630" y="230" width="30" height="40" fill="url(#glassShineDay)" rx="1" />
        <rect x="820" y="210" width="30" height="40" fill="url(#glassShineDay)" rx="1" />
        <rect x="995" y="200" width="25" height="40" fill="url(#glassShineDay)" rx="1" />
        <rect x="1175" y="180" width="35" height="50" fill="url(#glassShineDay)" rx="1" />
        <rect x="1395" y="190" width="30" height="30" fill="url(#glassShineDay)" rx="1" />
        <rect x="1665" y="220" width="25" height="30" fill="url(#glassShineDay)" rx="1" />

        {/* Sun bounce light on building tops */}
        <rect x="80" y="185" width="30" height="8" fill="url(#sunBounce)" rx="1" />
        <rect x="215" y="175" width="35" height="6" fill="url(#sunBounce)" rx="1" />
        <rect x="435" y="210" width="25" height="5" fill="url(#sunBounce)" rx="1" />
        <rect x="995" y="185" width="20" height="5" fill="url(#sunBounce)" rx="1" />
        <rect x="1175" y="165" width="35" height="6" fill="url(#sunBounce)" rx="1" />
        <rect x="1395" y="180" width="25" height="5" fill="url(#sunBounce)" rx="1" />
      </svg>

      {/* ======= GROUND ======= */}
      <div className="ground-day">
        <div className="road-reflection-day" />
        <div className="road-markings">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`rm${i}`} className="road-dash-day" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>

        {/* Cars */}
        <div className="car car-right">
          <div className="headlight-day" />
          <div className="taillight-day" />
        </div>
        <div className="car car-left">
          <div className="headlight-day" />
          <div className="taillight-day" />
        </div>
      </div>

      {/* Heat haze */}
      <div className="heat-haze" />
    </div>
  );
}
