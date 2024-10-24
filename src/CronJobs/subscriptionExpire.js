import cron from 'node-cron';

export default subscriptionExpire = function(User){
    cron.schedule('0 0 * * *', async () => {
        try {
            const currentDate = new Date();
    
            const expiredUsers = await User.find({ plan_expiry_date: { $lt: currentDate }, plan: { $ne: null } });
    
            expiredUsers.forEach(async (user) => {
                user.plan = null;  
                user.plan_expiry_date = null;  
                user.contacts_quota = null;  
                await user.save();
            });
    
            console.log(`Expired plans processed at ${new Date()}`);
        } catch (error) {
            console.error('Error expiring plans:', error);
        }
    });
}


