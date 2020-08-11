import dbConnect from "utils/dbConnect";
import { Top500PlacementModel, XRankTopPlayer } from "@sendou-ink/database";
import { GetStaticProps, NextPage } from "next";

export const getStaticProps: GetStaticProps<{
  topPlayers: XRankTopPlayer[];
}> = async () => {
  await dbConnect();

  const topPlayers = await Top500PlacementModel.findTopPlayers(
    "Custom E-liter 4K"
  );

  return { props: { topPlayers } };
};

const Top500LeaderboardsPage: NextPage<{ topPlayers: XRankTopPlayer[] }> = ({
  topPlayers,
}) => {
  console.log("topP", topPlayers);
  return (
    <>
      <div>moi</div>
    </>
  );
};

export default Top500LeaderboardsPage;
