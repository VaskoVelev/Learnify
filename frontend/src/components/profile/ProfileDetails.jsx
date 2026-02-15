import { User, Mail, Shield, Calendar, CheckCircle } from "lucide-react";
import ProfileDetailItem from "./ProfileDetailItem";

const ProfileDetails = ({ user, formatDate }) => {
    return (
        <div className="p-8">
            <h3 className="text-lg font-semibold text-white mb-6">
                Account Details
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
                <ProfileDetailItem
                    icon={User}
                    label="First Name"
                    value={user?.firstName}
                    iconBg="bg-teal-500/20"
                    iconColor="text-teal-400"
                />
                <ProfileDetailItem
                    icon={User}
                    label="Last Name"
                    value={user?.lastName}
                    iconBg="bg-teal-500/20"
                    iconColor="text-teal-400"
                />
                <ProfileDetailItem
                    icon={Mail}
                    label="Email Address"
                    value={user?.email}
                    iconBg="bg-cyan-500/20"
                    iconColor="text-cyan-400"
                />
                <ProfileDetailItem
                    icon={Shield}
                    label="Account Role"
                    value={user?.role}
                    iconBg="bg-purple-500/20"
                    iconColor="text-purple-400"
                />
                <ProfileDetailItem
                    icon={Calendar}
                    label="Member Since"
                    value={formatDate(user?.createdAt)}
                    iconBg="bg-amber-500/20"
                    iconColor="text-amber-400"
                />
                <ProfileDetailItem
                    icon={CheckCircle}
                    label="Account Status"
                    value="Active"
                    valueColor="text-emerald-400"
                    iconBg="bg-emerald-500/20"
                    iconColor="text-emerald-400"
                />
            </div>
        </div>
    );
};

export default ProfileDetails;