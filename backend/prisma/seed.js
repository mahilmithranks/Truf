import prisma from '../src/config/database.js';

// Mock turf data for Indian cities
const generateMockTurfs = () => {
    const cities = [
        { name: 'Mumbai', state: 'Maharashtra' },
        { name: 'Delhi', state: 'Delhi' },
        { name: 'Bangalore', state: 'Karnataka' },
        { name: 'Hyderabad', state: 'Telangana' },
        { name: 'Ahmedabad', state: 'Gujarat' },
        { name: 'Chennai', state: 'Tamil Nadu' },
        { name: 'Kolkata', state: 'West Bengal' },
        { name: 'Pune', state: 'Maharashtra' },
        { name: 'Jaipur', state: 'Rajasthan' },
        { name: 'Surat', state: 'Gujarat' },
        { name: 'Lucknow', state: 'Uttar Pradesh' },
        { name: 'Kanpur', state: 'Uttar Pradesh' },
        { name: 'Nagpur', state: 'Maharashtra' },
        { name: 'Indore', state: 'Madhya Pradesh' },
        { name: 'Thane', state: 'Maharashtra' },
        { name: 'Bhopal', state: 'Madhya Pradesh' },
        { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
        { name: 'Patna', state: 'Bihar' },
        { name: 'Vadodara', state: 'Gujarat' },
        { name: 'Ghaziabad', state: 'Uttar Pradesh' },
        { name: 'Ludhiana', state: 'Punjab' },
        { name: 'Agra', state: 'Uttar Pradesh' },
        { name: 'Nashik', state: 'Maharashtra' },
        { name: 'Faridabad', state: 'Haryana' },
        { name: 'Meerut', state: 'Uttar Pradesh' },
        { name: 'Rajkot', state: 'Gujarat' },
        { name: 'Varanasi', state: 'Uttar Pradesh' },
        { name: 'Srinagar', state: 'Jammu and Kashmir' },
        { name: 'Aurangabad', state: 'Maharashtra' },
        { name: 'Dhanbad', state: 'Jharkhand' },
        { name: 'Amritsar', state: 'Punjab' },
        { name: 'Navi Mumbai', state: 'Maharashtra' },
        { name: 'Allahabad', state: 'Uttar Pradesh' },
        { name: 'Ranchi', state: 'Jharkhand' },
        { name: 'Howrah', state: 'West Bengal' },
        { name: 'Coimbatore', state: 'Tamil Nadu' },
        { name: 'Jabalpur', state: 'Madhya Pradesh' },
        { name: 'Gwalior', state: 'Madhya Pradesh' },
        { name: 'Vijayawada', state: 'Andhra Pradesh' },
        { name: 'Jodhpur', state: 'Rajasthan' },
        { name: 'Madurai', state: 'Tamil Nadu' },
        { name: 'Raipur', state: 'Chhattisgarh' },
        { name: 'Kota', state: 'Rajasthan' },
        { name: 'Chandigarh', state: 'Chandigarh' },
        { name: 'Guwahati', state: 'Assam' },
        { name: 'Mysore', state: 'Karnataka' },
        { name: 'Bhubaneswar', state: 'Odisha' },
        { name: 'Noida', state: 'Uttar Pradesh' },
        { name: 'Jamshedpur', state: 'Jharkhand' },
        { name: 'Kochi', state: 'Kerala' },
        { name: 'Dehradun', state: 'Uttarakhand' },
        { name: 'Jammu', state: 'Jammu and Kashmir' },
        { name: 'Mangalore', state: 'Karnataka' },
        { name: 'Udaipur', state: 'Rajasthan' },
    ];

    const turfNames = ['Arena', 'Stadium', 'Sports Complex', 'Turf Zone', 'Play Ground', 'Champions Field'];
    const sports = ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];
    const amenities = ['Parking', 'Changing Rooms', 'Washrooms', 'Drinking Water', 'First Aid', 'Lighting', 'Seating Area', 'Cafeteria'];

    const turfs = [];

    cities.forEach((city) => {
        // Generate 3-5 turfs per city
        const numTurfs = Math.floor(Math.random() * 3) + 3;

        for (let i = 0; i < numTurfs; i++) {
            const turfName = turfNames[Math.floor(Math.random() * turfNames.length)];
            const numSports = Math.floor(Math.random() * 3) + 2; // 2-4 sports
            const selectedSports = [];

            // Select random sports
            while (selectedSports.length < numSports) {
                const sport = sports[Math.floor(Math.random() * sports.length)];
                if (!selectedSports.includes(sport)) {
                    selectedSports.push(sport);
                }
            }

            // Select random amenities
            const numAmenities = Math.floor(Math.random() * 4) + 4; // 4-7 amenities
            const selectedAmenities = [];
            while (selectedAmenities.length < numAmenities) {
                const amenity = amenities[Math.floor(Math.random() * amenities.length)];
                if (!selectedAmenities.includes(amenity)) {
                    selectedAmenities.push(amenity);
                }
            }

            const price = (Math.floor(Math.random() * 10) + 5) * 100; // 500-1400
            const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0
            const reviews = Math.floor(Math.random() * 200) + 10; // 10-210

            turfs.push({
                name: `${turfName} ${city.name} ${i + 1}`,
                description: `Premium ${selectedSports.join(', ')} turf in ${city.name}. Well-maintained facility with modern amenities.`,
                address: `Sector ${Math.floor(Math.random() * 50) + 1}, ${city.name}`,
                city: city.name,
                state: city.state,
                pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
                images: [
                    'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2340',
                    'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2340',
                    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2340'
                ],
                amenities: selectedAmenities,
                sports: selectedSports,
                pricePerHour: price,
                rating: parseFloat(rating),
                totalReviews: reviews,
                contactEmail: `contact@${turfName.toLowerCase().replace(' ', '')}${city.name.toLowerCase()}.com`,
                contactPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                availability: {
                    monday: { open: '06:00', close: '23:00' },
                    tuesday: { open: '06:00', close: '23:00' },
                    wednesday: { open: '06:00', close: '23:00' },
                    thursday: { open: '06:00', close: '23:00' },
                    friday: { open: '06:00', close: '23:00' },
                    saturday: { open: '06:00', close: '23:00' },
                    sunday: { open: '06:00', close: '23:00' }
                },
                status: 'ACTIVE'
            });
        }
    });

    return turfs;
};

async function seed() {
    try {
        console.log('🌱 Starting database seed...');

        // Clear existing turfs
        console.log('🗑️  Clearing existing turfs...');
        await prisma.turf.deleteMany({});

        // Generate and insert mock turfs
        console.log('📝 Generating mock turf data...');
        const mockTurfs = generateMockTurfs();

        console.log(`✨ Creating ${mockTurfs.length} turfs across Indian cities...`);

        for (const turf of mockTurfs) {
            await prisma.turf.create({
                data: turf
            });
        }

        console.log('✅ Database seeded successfully!');
        console.log(`📊 Total turfs created: ${mockTurfs.length}`);

        // Show summary
        const cityCounts = {};
        mockTurfs.forEach(turf => {
            cityCounts[turf.city] = (cityCounts[turf.city] || 0) + 1;
        });

        console.log('\n📍 Turfs per city:');
        Object.entries(cityCounts).forEach(([city, count]) => {
            console.log(`   ${city}: ${count} turfs`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
