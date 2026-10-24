package com.sameer.gym.dashboard;

public record DashboardResponse(long totalMembers, long activeMembers, long expiredMembers, long expiringSoon) {}
