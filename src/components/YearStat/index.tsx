import { lazy, Suspense } from 'react';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { formatPace } from '@/utils/utils';
import useHover from '@/hooks/useHover';
import { yearStats, githubYearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import { SHOW_ELEVATION_GAIN, IS_CHINESE, ACTIVITY_TYPES } from '@/utils/const';
import { DIST_UNIT, M_TO_DIST, M_TO_ELEV, type Activity } from '@/utils/utils';

interface TypeStat {
  label: string;
  count: number;
  distance: number;
}

const getTypeLabel = (type: string): string => {
  const t = type.toLowerCase();
  if (t === 'run') return ACTIVITY_TYPES.RUN_GENERIC_TITLE;
  if (t === 'ride' || t === 'cycling') return ACTIVITY_TYPES.CYCLING_TITLE;
  if (t === 'hike' || t === 'hiking') return ACTIVITY_TYPES.HIKING_TITLE;
  if (t === 'walk' || t === 'walking') return ACTIVITY_TYPES.WALKING_TITLE;
  if (t === 'swim' || t === 'swimming') return ACTIVITY_TYPES.SWIMMING_TITLE;
  if (t.includes('ski')) return ACTIVITY_TYPES.SKIING_TITLE;
  return type;
};

const computeTypeStats = (runs: Activity[]): TypeStat[] => {
  const map = new Map<string, TypeStat>();
  runs.forEach((run) => {
    const label = getTypeLabel(run.type);
    const existing = map.get(label);
    if (existing) {
      existing.count += 1;
      existing.distance += run.distance || 0;
    } else {
      map.set(label, {
        label,
        count: 1,
        distance: run.distance || 0,
      });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.distance - a.distance);
};

const YearStat = ({
  year,
  onClick,
}: {
  year: string;
  onClick: (_year: string) => void;
}) => {
  let { activities: runs, years } = useActivities();
  const [hovered, eventHandlers] = useHover();
  const YearSVG = lazy(() => loadSvgComponent(yearStats, `./year_${year}.svg`));
  const GithubYearSVG = lazy(() =>
    loadSvgComponent(githubYearStats, `./github_${year}.svg`)
  );

  if (years.includes(year)) {
    runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  }

  let sumDistance = 0;
  let streak = 0;
  let sumElevationGain = 0;
  let totalMetersAvail = 0;
  let totalSecondsAvail = 0;
  let heartRate = 0;
  let heartRateNullCount = 0;

  runs.forEach((run) => {
    sumDistance += run.distance || 0;
    sumElevationGain += run.elevation_gain || 0;
    if (run.average_speed) {
      totalMetersAvail += run.distance || 0;
      totalSecondsAvail += (run.distance || 0) / run.average_speed;
    }
    if (run.average_heartrate) {
      heartRate += run.average_heartrate;
    } else {
      heartRateNullCount++;
    }
    if (run.streak) {
      streak = Math.max(streak, run.streak);
    }
  });

  sumDistance = parseFloat((sumDistance / M_TO_DIST).toFixed(1));
  const sumElevationGainStr = (sumElevationGain * M_TO_ELEV).toFixed(0);
  const avgPace = formatPace(totalMetersAvail / totalSecondsAvail);
  const hasHeartRate = heartRate !== 0;
  const avgHeartRate = (heartRate / (runs.length - heartRateNullCount)).toFixed(
    0
  );

  const typeStats = computeTypeStats(runs);

  const activitiesLabel = IS_CHINESE ? ' 次活动' : ' Activities';
  const distLabel = ` ${DIST_UNIT}`;

  return (
    <div className="cursor-pointer" onClick={() => onClick(year)}>
      <section {...eventHandlers}>
        <Stat value={year} description=" Journey" />
        <Stat value={runs.length} description={activitiesLabel} />
        <Stat value={sumDistance} description={distLabel} />
        {SHOW_ELEVATION_GAIN && (
          <Stat value={sumElevationGainStr} description=" Elevation Gain" />
        )}
        <Stat value={avgPace} description=" Avg Pace" />
        <Stat value={`${streak} day`} description=" Streak" />
        {hasHeartRate && (
          <Stat value={avgHeartRate} description=" Avg Heart Rate" />
        )}
        {typeStats.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-80">
            {typeStats.map((ts) => (
              <span key={ts.label}>
                {ts.label} {ts.count}
                {IS_CHINESE ? '次' : ''} /{' '}
                {(ts.distance / M_TO_DIST).toFixed(1)}
                {DIST_UNIT}
              </span>
            ))}
          </div>
        )}
      </section>
      {year !== 'Total' && hovered && (
        <Suspense fallback="loading...">
          <YearSVG className="year-svg my-4 h-4/6 w-4/6 border-0 p-0" />
          <GithubYearSVG className="github-year-svg my-4 h-auto w-full border-0 p-0" />
        </Suspense>
      )}
      <hr />
    </div>
  );
};

export default YearStat;
