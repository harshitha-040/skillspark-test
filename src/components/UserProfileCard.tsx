import { useEffect, useState } from "react";

interface Props {
  stats: any;
}

function UserProfileCard({ stats }: Props) {

  const [user, setUser] =
    useState<any>(null);

  const [badges, setBadges] =
    useState<any>({
      earned: [],
      locked: [],
    });

  useEffect(() => {

    const storedUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    setUser(storedUser);

    if (!storedUser) return;

    /* =========================
       FETCH BADGES
    ========================= */

    fetch(
      `http://localhost:5000/api/badges/${storedUser.id}`
    )

      .then((res) => res.json())

      .then((data) => {

        console.log(
          "BADGES:",
          data
        );

        setBadges(data);

      })

      .catch((err) => {

        console.log(
          "Badge Error:",
          err
        );

      });

  }, []);

  /* =========================
     DYNAMIC STREAK
  ========================= */

  const streak =
    stats?.totalTests || 0;

  return (

    <div className="bg-white/5 border border-cyan-500/10 rounded-3xl p-6 backdrop-blur-lg">

      {/* =========================
          PROFILE
      ========================= */}

      <div className="flex items-center gap-4">

        <div className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-black">

          {user?.username
            ?.charAt(0)
            ?.toUpperCase() || "U"}

        </div>

        <div>

          <h2 className="text-2xl font-bold">

            {user?.username || "User"}

          </h2>

          <p className="text-gray-400">

            {user?.email || "No Email"}

          </p>

          <p className="text-cyan-400 text-sm mt-1">

            Plan:
            {" "}
            {user?.plan || "Free"}

          </p>

        </div>

      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-white/5 rounded-2xl p-4">

          <p className="text-gray-400 text-sm">

            Current Streak

          </p>

          <h3 className="text-cyan-400 text-2xl font-bold">

            {streak} Tests

          </h3>

        </div>

        <div className="bg-white/5 rounded-2xl p-4">

          <p className="text-gray-400 text-sm">

            Skills Mastered

          </p>

          <h3 className="text-cyan-400 text-2xl font-bold">

            {stats?.technologies || 0}

          </h3>

        </div>

      </div>

      {/* =========================
          EARNED BADGES
      ========================= */}

      <div className="mt-8">

        <p className="text-cyan-400 uppercase tracking-[4px] text-sm mb-4">

          Earned Badges

        </p>

        <div className="flex flex-wrap gap-3">

          {badges?.earned?.length > 0 ? (

            badges.earned.map(
              (
                badge: any,
                index: number
              ) => {

                let badgeStyle =
                  "bg-cyan-500/10 border-cyan-400/20 text-cyan-300";

                /* =========================
                   STANDARD
                ========================= */

                if (
                  badge.tier ===
                  "standard"
                ) {

                  badgeStyle =
                    "bg-purple-500/10 border-purple-400/20 text-purple-300";

                }

                /* =========================
                   PRO
                ========================= */

                if (
                  badge.tier ===
                  "pro"
                ) {

                  badgeStyle =
                    "bg-yellow-500/10 border-yellow-400/20 text-yellow-300";

                }

                return (

                  <div
                    key={index}
                    className={`px-4 py-3 rounded-2xl border ${badgeStyle}`}
                  >

                    <p className="font-semibold text-sm">

                      {badge.icon}
                      {" "}
                      {badge.title}

                    </p>

                  </div>

                );

              }
            )

          ) : (

            <div className="text-gray-500">

              No badges earned yet

            </div>

          )}

        </div>

      </div>

      {/* =========================
          LOCKED BADGES
      ========================= */}

      <div className="mt-8">

        <p className="text-gray-400 uppercase tracking-[4px] text-sm mb-4">

          Locked Badges

        </p>

        <div className="flex flex-wrap gap-3">

          {badges?.locked?.length > 0 ? (

            badges.locked.map(
              (
                badge: any,
                index: number
              ) => (

                <div
                  key={index}
                  className="px-4 py-3 rounded-2xl border border-gray-700 bg-white/5 text-gray-400"
                >

                  <p className="font-semibold text-sm">

                    {badge.icon}
                    {" "}
                    {badge.title}

                  </p>

                </div>

              )
            )

          ) : (

            <div className="text-gray-500">

              No locked badges

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default UserProfileCard;

