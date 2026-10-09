export default function Loading(){return <div className="metric-grid" aria-label="Chargement" aria-busy="true">{[1,2,3,4].map(n=><div className="skeleton" key={n}/>)}</div>;}
