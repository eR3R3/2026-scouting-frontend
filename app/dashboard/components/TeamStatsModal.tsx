import { calculateAutoScore, calculateTeleopScore, calculateEndGameScore } from '@/app/lib/utils';

export function TeamStatsModal({ team }) {
  const autoScore = calculateAutoScore(team.autonomous);
  const teleopScore = calculateTeleopScore(team.teleop);
  const endGameScore = calculateEndGameScore(team.endAndAfterGame?.towerStatus);
  const totalScore = autoScore + teleopScore + endGameScore;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div><p className="text-sm text-gray-600">Auto Score</p><p className="font-medium">{autoScore}</p></div>
        <div><p className="text-sm text-gray-600">Teleop Score</p><p className="font-medium">{teleopScore}</p></div>
        <div><p className="text-sm text-gray-600">End Game</p><p className="font-medium">{endGameScore}</p></div>
        <div><p className="text-sm text-gray-600">Total Score</p><p className="font-medium">{totalScore}</p></div>
      </div>

      {/* Autonomous Details */}
      <div className="bg-default-50 p-3 rounded-lg">
        <h4 className="font-medium mb-2">Autonomous</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Fuel Count</span><span>{team.autonomous?.fuelCount || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Tower L1</span><span>{team.autonomous?.isTowerSuccess ? "Yes (+15)" : "No"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Left Zone</span><span>{team.autonomous?.leftStartingZone ? "Yes" : "No"}</span></div>
        </div>
      </div>

      {/* Teleop Details */}
      <div className="bg-default-50 p-3 rounded-lg">
        <h4 className="font-medium mb-2">Teleop</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Fuel Count</span><span>{team.teleop?.fuelCount || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Human Fuel</span><span>{team.teleop?.humanFuelCount || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Pass Bump</span><span>{team.teleop?.passBump ? "Yes" : "No"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Pass Trench</span><span>{team.teleop?.passTrench ? "Yes" : "No"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Fetch Pref</span><span>{team.teleop?.fetchBallPreference || "N/A"}</span></div>
        </div>
      </div>

      {/* End Game Details */}
      <div className="bg-default-50 p-3 rounded-lg">
        <h4 className="font-medium mb-2">End Game</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Tower Status</span><span>{team.endAndAfterGame?.towerStatus || "None"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Climbing Time</span><span>{team.endAndAfterGame?.climbingTime || "N/A"}s</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Ranking Pts</span><span>{team.endAndAfterGame?.rankingPoint || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Coop Point</span><span>{team.endAndAfterGame?.coopPoint ? "Yes" : "No"}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-default-50 p-3 rounded-lg"><p className="text-sm text-gray-600">Auto Movement</p><p className="font-medium">{team.endAndAfterGame?.autonomousMove ? "Yes" : "No"}</p></div>
        <div className="bg-default-50 p-3 rounded-lg"><p className="text-sm text-gray-600">Teleop Movement</p><p className="font-medium">{team.endAndAfterGame?.teleopMove ? "Yes" : "No"}</p></div>
      </div>

      {team.endAndAfterGame?.comments && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Comments</p>
          <p className="whitespace-pre-wrap bg-default-50 p-4 rounded-lg">{team.endAndAfterGame.comments}</p>
        </div>
      )}
    </div>
  );
}
