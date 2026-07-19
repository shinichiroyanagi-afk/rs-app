import { useEffect, useState } from "react";

const RankBadge = ({ value }) => {
  if (value === null || value === undefined) return <span style={{ color: "#666" }}>-</span>;
  let bg = "#7f1d1d";
  if (value >= 80) bg = "#14532d";
  else if (value >= 60) bg = "#166534";
  else if (value >= 40) bg = "#1e3a2f";
  else if (value >= 20) bg = "#431407";
  const color = "#e2e8f0";
  return (
    <span style={{
      background: bg, color, borderRadius: 4,
      padding: "2px 8px", fontWeight: "bold", fontSize: 13
    }}>
      {value}
    </span>
  );
};

const PctCell = ({ value }) => {
  const color = value > 0 ? "#4ade80" : value < 0 ? "#f87171" : "#e2e8f0";
  return <span style={{ color, fontWeight: "bold" }}>{value?.toFixed(2)}</span>;
};

const Table = ({ data, showName }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
    <thead>
      <tr style={{ background: "#1e1e1e", borderBottom: "1px solid #333" }}>
        <th style={th}>Now</th>
        <th style={th}>1D</th>
        <th style={th}>1W</th>
        <th style={th}>1M</th>
        <th style={th}>Ticker</th>
        <th style={th}>Name</th>
        <th style={th}>Price</th>
        <th style={th}>RS Day%</th>
        <th style={th}>RS Wk%</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i} style={{
          borderBottom: "1px solid #222",
          background: i % 2 === 0 ? "#111111" : "#161616"
        }}>
          <td style={td}><RankBadge value={row.now} /></td>
          <td style={td}><RankBadge value={row.d1} /></td>
          <td style={td}><RankBadge value={row.w1} /></td>
          <td style={td}><RankBadge value={row.m1} /></td>
          <td style={{ ...td, fontWeight: "bold", color: "#60a5fa" }}>{row.ticker}</td>
          <td style={{ ...td, color: "#94a3b8" }}>{row.name || "-"}</td>
          <td style={{ ...td, color: "#e2e8f0" }}>{row.price?.toFixed(2)}</td>
          <td style={td}><PctCell value={row.rsDay} /></td>
          <td style={td}><PctCell value={row.rsWk} /></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const th = { padding: "6px 6px", textAlign: "center", fontWeight: "bold", color: "#94a3b8", fontSize: "11px", whiteSpace: "nowrap" };
const td = { padding: "4px 6px", textAlign: "center", fontSize: "12px", whiteSpace: "nowrap" };

export default function App() {
  const [sectorData, setSectorData] = useState([]);
  const [themeData, setThemeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("https://rs-backend-p2gv.onrender.com/api/sector").then(r => r.json()),
      fetch("https://rs-backend-p2gv.onrender.com/api/theme").then(r => r.json()),
    ]).then(([sector, theme]) => {
      setSectorData(sector);
      setThemeData(theme);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: 100, fontSize: 20, color: "#e2e8f0", background: "#0a0a0a", minHeight: "100vh" }}>
      📊 データ取得中...
    </div>
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", overflowX: "auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 4, color: "#f1f5f9" }}>📊 ETF RSランク</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>相対強度ランク（0〜100）上位ほど強い</p>

        <h2 style={{ fontSize: 20, marginBottom: 12, color: "#cbd5e1" }}>🏭 Sector Leaders</h2>
        <Table data={sectorData} showName={true} />

        <hr style={{ margin: "32px 0", borderColor: "#222" }} />

        <h2 style={{ fontSize: 20, marginBottom: 12, color: "#cbd5e1" }}>📈 Industry RS Rank</h2>
        <Table data={themeData} showName={false} />
      </div>
    </div>
  );
}