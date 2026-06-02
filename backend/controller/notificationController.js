import Notification from "../models/notificationModel.js";

export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Fetching notifications error: ${err}`
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Ensure user owns this notification
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this notification"
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Updating notification error: ${err}`
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        
        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Updating notifications error: ${err}`
        });
    }
};
