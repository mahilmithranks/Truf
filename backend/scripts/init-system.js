import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Admin credentials
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123';

// Initialize the system with test data
async function initializeSystem() {
    try {
        console.log('🚀 Starting system initialization...\n');

        // Step 1: Create Admin User
        console.log('📝 Step 1: Creating admin user...');
        let adminToken;

        try {
            const registerResponse = await axios.post(`${API_URL}/auth/register`, {
                name: 'Admin User',
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'ADMIN'
            });
            adminToken = registerResponse.data.data.token;
            console.log('✅ Admin user created successfully!');
        } catch (error) {
            if (error.response?.status === 400) {
                // User already exists, try to login
                console.log('ℹ️  Admin user already exists, logging in...');
                const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD
                });
                adminToken = loginResponse.data.data.token;
                console.log('✅ Admin logged in successfully!');
            } else {
                throw error;
            }
        }

        // Step 2: Create Turf Settings
        console.log('\n📝 Step 2: Creating turf settings...');
        try {
            await axios.post(`${API_URL}/turf`, {
                name: 'Green Valley Sports Turf',
                description: 'Premium football turf with modern facilities, floodlights, and professional-grade artificial grass. Perfect for matches and practice sessions.',
                location: '123 Main Street, Sports Complex, Bangalore - 560001',
                pricePerHour: 1000,
                contactEmail: 'contact@greenvalley.com',
                contactPhone: '9876543210',
                openTime: '06:00',
                closeTime: '22:00',
                slotDuration: 60,
                amenities: [
                    'Parking',
                    'Changing Room',
                    'Washroom',
                    'Drinking Water',
                    'First Aid Kit',
                    'Floodlights',
                    'Seating Area'
                ]
            }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Turf settings created successfully!');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('ℹ️  Turf settings already exist!');
            } else {
                throw error;
            }
        }

        // Step 3: Generate Slots
        console.log('\n📝 Step 3: Generating slots...');
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30); // 30 days from now

        try {
            const response = await axios.post(`${API_URL}/slots/generate`, {
                startDate: today.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                timeSlots: [
                    { startTime: '06:00', endTime: '07:00' },
                    { startTime: '07:00', endTime: '08:00' },
                    { startTime: '08:00', endTime: '09:00' },
                    { startTime: '09:00', endTime: '10:00' },
                    { startTime: '10:00', endTime: '11:00' },
                    { startTime: '11:00', endTime: '12:00' },
                    { startTime: '17:00', endTime: '18:00' },
                    { startTime: '18:00', endTime: '19:00' },
                    { startTime: '19:00', endTime: '20:00' },
                    { startTime: '20:00', endTime: '21:00' },
                    { startTime: '21:00', endTime: '22:00' }
                ]
            }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`✅ Generated ${response.data.data.length} slots successfully!`);
        } catch (error) {
            console.log('⚠️  Some slots may already exist, continuing...');
        }

        console.log('\n✨ System initialization complete!\n');
        console.log('📋 Summary:');
        console.log('   - Admin Email: admin@test.com');
        console.log('   - Admin Password: admin123');
        console.log('   - Turf: Green Valley Sports Turf');
        console.log('   - Price: ₹1,000/hour');
        console.log('   - Slots: Generated for next 30 days');
        console.log('\n🌐 Open http://localhost:3000 to start using the system!');
        console.log('\n💡 Test User Flow:');
        console.log('   1. Register as a new user');
        console.log('   2. Book a slot');
        console.log('   3. Complete mock payment (click OK)');
        console.log('   4. View your bookings');
        console.log('\n🔐 Test Admin Flow:');
        console.log('   1. Login with admin credentials');
        console.log('   2. View dashboard at /admin/dashboard');
        console.log('   3. Manage slots, bookings, and settings');

    } catch (error) {
        console.error('\n❌ Error during initialization:');
        console.error(error.response?.data || error.message);
        console.error('\n💡 Make sure:');
        console.error('   - Backend is running on http://localhost:5000');
        console.error('   - Database is migrated (run: npx prisma migrate dev)');
        console.error('   - PostgreSQL is running');
    }
}

// Run initialization
initializeSystem();
