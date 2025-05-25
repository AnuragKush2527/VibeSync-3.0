import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TopBar, ProfileCard, FriendsCard } from "../components";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CustomButton from "../components/CustomButton";
import { apiRequest } from "../utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [postAnalysis, setPostAnalysis] = useState([]);
  const [commentAnalysis, setCommentAnalysis] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [overallScore, setOverallScore] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const res = await apiRequest({
        url: "/users/dashboard-analysis",
        token: user?.token,
        method: "GET",
      });

      console.log(res.data.overallScore);

      if (res?.status !== "failed") {
        setPostAnalysis(res?.data.postSentiments ?? []);
        setCommentAnalysis(res?.data.commentSentiments ?? []);
        setTopPosts(res?.data.topPosts ?? []);
        setOverallScore(res?.data.overallScore ?? 0);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderPie = (data, title) => (
    <div className="bg-primary rounded-lg p-4 shadow-md w-full">
      <h2 className="text-ascent-1 text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <TopBar />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard user={user} />
          <FriendsCard friends={user?.friends} />
        </div>

        <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
          <div className="w-full bg-primary p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-ascent-1">
              Dashboard Overview
            </h1>
            <p className="text-ascent-2 mt-1">
              Overall Sentiment Score:{" "}
              <span className="font-bold text-blue">{overallScore}</span>
            </p>
          </div>

          <div className="w-full flex flex-wrap gap-6">
            {renderPie(postAnalysis, "User's Post Sentiment Analysis")}
            {renderPie(commentAnalysis, "Comments on User's Posts Analysis")}
          </div>

          <div className="w-full bg-primary p-6 rounded-lg shadow-sm mt-4">
            <h2 className="text-xl font-semibold text-ascent-1 mb-4">
              Top 5 Posts
            </h2>
            <ul className="flex flex-col gap-4">
              {topPosts.map((post, idx) => (
                <li
                  key={post._id}
                  className="bg-bgColor p-4 rounded-lg shadow-sm"
                >
                  <p className="text-ascent-1 font-medium">
                    {post.description}
                  </p>
                  <p className="text-sm text-ascent-2 mt-1">
                    Score:{" "}
                    <span className="font-semibold text-blue">
                      {post.score}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          {/* You can leave this empty or add additional widgets */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
