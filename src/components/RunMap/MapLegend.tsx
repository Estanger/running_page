import { IS_CHINESE } from '@/utils/const';
import {
  RUN_COLOR_LIGHT,
  CYCLING_COLOR,
  HIKING_COLOR,
  SWIMMING_COLOR,
  RUN_TRAIL_COLOR,
} from '@/utils/const';

interface LegendItem {
  color: string;
  label: string;
}

const legendItems: LegendItem[] = [
  { color: RUN_COLOR_LIGHT, label: IS_CHINESE ? '跑步' : 'Run' },
  { color: CYCLING_COLOR, label: IS_CHINESE ? '骑行' : 'Ride' },
  { color: HIKING_COLOR, label: IS_CHINESE ? '徒步/步行' : 'Hike/Walk' },
  { color: SWIMMING_COLOR, label: IS_CHINESE ? '游泳' : 'Swim' },
  { color: RUN_TRAIL_COLOR, label: IS_CHINESE ? '越野跑' : 'Trail' },
];

const MapLegend = () => (
  <div
    style={{
      position: 'absolute',
      bottom: '40px',
      left: '10px',
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      lineHeight: '18px',
      zIndex: 1,
      backdropFilter: 'blur(4px)',
    }}
  >
    {legendItems.map((item) => (
      <div
        key={item.label}
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '3px',
            backgroundColor: item.color,
            borderRadius: '2px',
          }}
        />
        <span style={{ color: '#333' }}>{item.label}</span>
      </div>
    ))}
  </div>
);

export default MapLegend;
