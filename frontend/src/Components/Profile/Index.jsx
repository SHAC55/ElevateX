import React, { useEffect, useState } from "react";
import { Loader2, RefreshCcw, TriangleAlert } from "lucide-react";
import { getProfile } from "../../api/profile";
import ProfileInfo from "./ProfileInfo";

const Profile = ({ initialProfile = null, reloadProfile: parentReload, isRefreshing = false }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(!initialProfile);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProfile("me");
      setProfile(response);
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setLoading(false);
      return;
    }
    loadProfile();
  }, [initialProfile]);

  const handleRefresh = async () => {
    await loadProfile();
    if (parentReload) {
      parentReload();
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-[#eadfce] bg-white/92">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#c56c19]" />
          <div className="mt-4 text-sm text-[#6b5844]">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-[#eadfce] bg-white/92 p-8">
        <div className="max-w-md text-center">
          <TriangleAlert className="mx-auto h-10 w-10 text-[#c56c19]" />
          <div className="mt-4 text-xl font-semibold text-[#1f160f]">Could not load profile</div>
          <p className="mt-3 text-sm leading-7 text-[#6b5844]">{error}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f160f] px-5 py-3 text-sm font-semibold text-white"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return profile ? (
    <ProfileInfo profile={profile} reloadProfile={handleRefresh} isRefreshing={isRefreshing} />
  ) : null;
};

export default Profile;
