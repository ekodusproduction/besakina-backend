import cron from 'node-cron';

export default subscriptionExpire = function(User){
    cron.schedule('0 0 * * *', async () => {
        try {
            const currentDate = new Date();
    
            // Find users with expired plans
            const expiredUsers = await User.find({ plan_expiry_date: { $lt: currentDate }, plan: { $ne: null } });
    
            // Loop through the expired users and reset their plan details
            expiredUsers.forEach(async (user) => {
                user.plan = null;  
                user.plan_expiry_date = null;  // Reset the expiry date
                user.contacts_quota = null;  // Optionally reset other fields as needed
                await user.save();
            });
    
            console.log(`Expired plans processed at ${new Date()}`);
        } catch (error) {
            console.error('Error expiring plans:', error);
        }
    });
}


