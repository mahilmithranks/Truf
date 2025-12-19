import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const sampleTurfs = [
    {
        name: "Green Valley Sports Arena",
        description: "Premium turf with state-of-the-art facilities. Perfect for cricket and football matches with professional-grade synthetic grass.",
        address: "123 Sports Complex Road, Sector 15",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        latitude: 12.9716,
        longitude: 77.5946,
        images: [
            "/turfs/green-valley-1.jpg",
            "/turfs/green-valley-2.jpg",
            "/turfs/green-valley-3.jpg"
        ],
        amenities: ["Parking", "Washroom", "Changing Room", "Cafeteria", "First Aid", "Flood Lights"],
        sports: ["Cricket", "Football"],
        pricePerHour: 1500,
        rating: 4.5,
        totalReviews: 128,
        contactEmail: "greenvalley@turfbook.com",
        contactPhone: "+91 9876543210",
        availability: {
            monday: { open: "06:00", close: "22:00" },
            tuesday: { open: "06:00", close: "22:00" },
            wednesday: { open: "06:00", close: "22:00" },
            thursday: { open: "06:00", close: "22:00" },
            friday: { open: "06:00", close: "22:00" },
            saturday: { open: "06:00", close: "23:00" },
            sunday: { open: "06:00", close: "23:00" }
        },
        status: "ACTIVE"
    },
    {
        name: "Champions Cricket Ground",
        description: "Dedicated cricket turf with professional pitch and excellent drainage system. Ideal for serious cricket enthusiasts.",
        address: "456 Stadium Lane, Whitefield",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560066",
        latitude: 12.9698,
        longitude: 77.7499,
        images: [
            "/turfs/champions-1.jpg",
            "/turfs/champions-2.jpg"
        ],
        amenities: ["Parking", "Washroom", "Changing Room", "Seating Area", "Flood Lights", "Scoreboard"],
        sports: ["Cricket"],
        pricePerHour: 1800,
        rating: 4.7,
        totalReviews: 95,
        contactEmail: "champions@turfbook.com",
        contactPhone: "+91 9876543211",
        availability: {
            monday: { open: "06:00", close: "22:00" },
            tuesday: { open: "06:00", close: "22:00" },
            wednesday: { open: "06:00", close: "22:00" },
            thursday: { open: "06:00", close: "22:00" },
            friday: { open: "06:00", close: "22:00" },
            saturday: { open: "05:00", close: "23:00" },
            sunday: { open: "05:00", close: "23:00" }
        },
        status: "ACTIVE"
    },
    {
        name: "Urban Football Hub",
        description: "Modern football turf with FIFA-standard synthetic grass. Perfect for 5-a-side and 7-a-side matches.",
        address: "789 Sports Street, Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560034",
        latitude: 12.9352,
        longitude: 77.6245,
        images: [
            "/turfs/urban-football-1.jpg",
            "/turfs/urban-football-2.jpg",
            "/turfs/urban-football-3.jpg"
        ],
        amenities: ["Parking", "Washroom", "Changing Room", "Cafeteria", "Flood Lights", "Equipment Rental"],
        sports: ["Football"],
        pricePerHour: 1200,
        rating: 4.3,
        totalReviews: 156,
        contactEmail: "urbanfootball@turfbook.com",
        contactPhone: "+91 9876543212",
        availability: {
            monday: { open: "06:00", close: "22:00" },
            tuesday: { open: "06:00", close: "22:00" },
            wednesday: { open: "06:00", close: "22:00" },
            thursday: { open: "06:00", close: "22:00" },
            friday: { open: "06:00", close: "23:00" },
            saturday: { open: "06:00", close: "23:00" },
            sunday: { open: "06:00", close: "23:00" }
        },
        status: "ACTIVE"
    },
    {
        name: "All Sports Arena",
        description: "Multi-sport facility offering cricket, football, basketball, and badminton. Best for versatile sports enthusiasts.",
        address: "321 Arena Complex, Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        latitude: 12.9784,
        longitude: 77.6408,
        images: [
            "/turfs/all-sports-1.jpg",
            "/turfs/all-sports-2.jpg"
        ],
        amenities: ["Parking", "Washroom", "Changing Room", "Cafeteria", "Flood Lights", "Equipment Rental", "Seating Area"],
        sports: ["Cricket", "Football", "Basketball", "Badminton"],
        pricePerHour: 1600,
        rating: 4.6,
        totalReviews: 203,
        contactEmail: "allsports@turfbook.com",
        contactPhone: "+91 9876543213",
        availability: {
            monday: { open: "06:00", close: "22:00" },
            tuesday: { open: "06:00", close: "22:00" },
            wednesday: { open: "06:00", close: "22:00" },
            thursday: { open: "06:00", close: "22:00" },
            friday: { open: "06:00", close: "23:00" },
            saturday: { open: "05:00", close: "23:00" },
            sunday: { open: "05:00", close: "23:00" }
        },
        status: "ACTIVE"
    },
    {
        name: "Elite Sports Complex",
        description: "Premium sports facility with top-notch amenities. Features professional-grade turf and excellent customer service.",
        address: "567 Elite Road, HSR Layout",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560102",
        latitude: 12.9121,
        longitude: 77.6446,
        images: [
            "/turfs/elite-1.jpg",
            "/turfs/elite-2.jpg",
            "/turfs/elite-3.jpg"
        ],
        amenities: ["Parking", "Washroom", "Changing Room", "Cafeteria", "Flood Lights", "Equipment Rental", "Seating Area", "First Aid"],
        sports: ["Cricket", "Football", "Tennis"],
        pricePerHour: 2000,
        rating: 4.8,
        totalReviews: 87,
        contactEmail: "elite@turfbook.com",
        contactPhone: "+91 9876543214",
        availability: {
            monday: { open: "06:00", close: "22:00" },
            tuesday: { open: "06:00", close: "22:00" },
            wednesday: { open: "06:00", close: "22:00" },
            thursday: { open: "06:00", close: "22:00" },
            friday: { open: "06:00", close: "23:00" },
            saturday: { open: "05:00", close: "23:00" },
            sunday: { open: "05:00", close: "23:00" }
        },
        status: "ACTIVE"
    }
];

async function seedTurfs() {
    console.log('🌱 Seeding turfs...');

    try {
        // Clear existing turfs
        await prisma.turf.deleteMany({});
        console.log('✅ Cleared existing turfs');

        // Create new turfs
        for (const turf of sampleTurfs) {
            await prisma.turf.create({
                data: turf
            });
            console.log(`✅ Created turf: ${turf.name}`);
        }

        console.log(`🎉 Successfully seeded ${sampleTurfs.length} turfs!`);
    } catch (error) {
        console.error('❌ Error seeding turfs:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seed function
seedTurfs();
