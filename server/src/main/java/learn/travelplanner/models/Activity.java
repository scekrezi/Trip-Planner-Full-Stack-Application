package learn.travelplanner.models;

import java.time.LocalTime;
import java.util.Objects;

public class Activity {
    private int activityId;
    private TripDay tripDay;
    private int orderIndex;
    private String title;
    private String description;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
    private User createdBy;

    public Activity() {
    }

    public Activity(int activityId, TripDay tripDay, int orderIndex, String title, String description, String location, LocalTime startTime, LocalTime endTime, User createdBy) {
        this.activityId = activityId;
        this.tripDay = tripDay;
        this.orderIndex = orderIndex;
        this.title = title;
        this.description = description;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdBy = createdBy;
    }

    public int getActivityId() {
        return activityId;
    }

    public void setActivityId(int activityId) {
        this.activityId = activityId;
    }

    public TripDay getTripDay() {
        return tripDay;
    }

    public void setTripDay(TripDay tripDay) {
        this.tripDay = tripDay;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;

        Activity activity = (Activity) o;
        return activityId == activity.activityId && orderIndex == activity.orderIndex && Objects.equals(tripDay, activity.tripDay) && Objects.equals(title, activity.title) && Objects.equals(description, activity.description) && Objects.equals(location, activity.location) && Objects.equals(startTime, activity.startTime) && Objects.equals(endTime, activity.endTime) && Objects.equals(createdBy, activity.createdBy);
    }

    @Override
    public int hashCode() {
        int result = activityId;
        result = 31 * result + Objects.hashCode(tripDay);
        result = 31 * result + orderIndex;
        result = 31 * result + Objects.hashCode(title);
        result = 31 * result + Objects.hashCode(description);
        result = 31 * result + Objects.hashCode(location);
        result = 31 * result + Objects.hashCode(startTime);
        result = 31 * result + Objects.hashCode(endTime);
        result = 31 * result + Objects.hashCode(createdBy);
        return result;
    }
}
