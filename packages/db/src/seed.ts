import prisma from "./index";

async function main() {
    const hobbies = [
        { name: 'Football' },
        { name: 'Cricket' },
        { name: 'Basketball' },
        { name: 'Tennis' },
        { name: 'Table Tennis' },
        { name: 'Vollyeball' },
        { name: 'Bowling' },
    ];

    await Promise.all(
        hobbies.map(async (hobby) => {
            await prisma.hobby.upsert({
                where: { name: hobby.name },
                update: {},
                create: hobby
            })
        })
    );

    const teams = [
        { id: 1, name: 'The Game Changers', description: 'A group of friends who love playing all kinds of sports.', hobbyName: 'Football' },
        { id: 2, name: 'The Game Changers', description: 'A group of friends who love playing all kinds of sports.', hobbyName: 'Football' },
        { id: 3, name: 'The Game Changers', description: 'A group of friends who love playing all kinds of sports.', hobbyName: 'Football' },
        { id: 4, name: 'The Bat Swingers', description: 'Friends who hit it out of the park.', hobbyName: 'Cricket' },
        { id: 5, name: 'The Court Kings', description: 'A team of basketball enthusiasts always up for a challenge.', hobbyName: 'Basketball' },
        { id: 6, name: 'The Net Setters', description: 'A passionate tennis team with great serves and volleys.', hobbyName: 'Tennis' },
        { id: 7, name: 'The Paddle Pushers', description: 'Friends who can’t get enough of table tennis.', hobbyName: 'Table Tennis' },
        { id: 8, name: 'The Spike Squad', description: 'A dynamic group ready to spike the ball.', hobbyName: 'Volleyball' },
        { id: 9, name: 'The Pin Crushers', description: 'A friendly team that’s all about striking it big in bowling.', hobbyName: 'Bowling' },
        { id: 10, name: 'The Goal Getters', description: 'A versatile team that loves setting and achieving goals in various sports.', hobbyName: 'Football' },
        { id: 11, name: 'The Wicket Wizards', description: 'A group that knows how to spin and win on the cricket field.', hobbyName: 'Cricket' },
        { id: 12, name: 'The Dunk Masters', description: 'A high-flying basketball team with a knack for dunking.', hobbyName: 'Basketball' },
        { id: 13, name: 'The Serve Savants', description: 'A team with exceptional skills and a love for tennis.', hobbyName: 'Tennis' },
        { id: 14, name: 'The Spin Doctors', description: 'Table tennis players who know how to add some spin to the game.', hobbyName: 'Table Tennis' },
        { id: 15, name: 'The Beach Bumpers', description: 'A volleyball team that brings the beach vibes to every game.', hobbyName: 'Volleyball' },
        { id: 16, name: 'The Strike Force', description: 'A fun group who makes every bowling game a strike.', hobbyName: 'Bowling' },
    ];


    await Promise.all(
        teams.map(async (team) => {
            const hobby = await prisma.hobby.findUnique({
                where: { name: team.hobbyName },
            });

            if (hobby) {
                await prisma.team.upsert({
                    where: { id: team.id },
                    update: {},
                    create: {
                        name: team.name,
                        description: team.description,
                        hobbyId: hobby.id,
                    },
                });
            }
        })
    );

    const userTeams = [
        // { teamId: 1, userRoles: [{ userId: 1, role: 'Leader' }, { userId: 2, role: 'Member' }] },
        // { teamId: 2, userRoles: [{ userId: 3, role: 'Leader' },] },
        { teamId: 3, userRoles: [{ userId: 6, role: 'Leader' }, { userId: 7, role: 'Member' }, { userId: 1, role: 'Member' }, { userId: 5, role: 'Member' }, { userId: 8, role: 'Member' }] },
        { teamId: 4, userRoles: [{ userId: 6, role: 'Leader' }, { userId: 7, role: 'Member' }, { userId: 1, role: 'Member' }, { userId: 5, role: 'Member' }, { userId: 8, role: 'Member' }] },
        { teamId: 5, userRoles: [{ userId: 6, role: 'Leader' }, { userId: 8, role: 'Member' }, { userId: 7, role: 'Member' }, { userId: 1, role: 'Member' }, { userId: 5, role: 'Member' }] },
        { teamId: 6, userRoles: [{ userId: 7, role: 'Leader' }, { userId: 6, role: 'Member' }, { userId: 8, role: 'Member' }, { userId: 1, role: 'Member' }, { userId: 5, role: 'Member' }] },
        { teamId: 7, userRoles: [{ userId: 7, role: 'Leader' },] },
        { teamId: 8, userRoles: [{ userId: 7, role: 'Leader' },] },
        { teamId: 9, userRoles: [{ userId: 7, role: 'Leader' },] },
        { teamId: 10, userRoles: [{ userId: 1, role: 'Leader' }, { userId: 7, role: 'Member' }] },
        { teamId: 11, userRoles: [{ userId: 1, role: 'Leader' }, { userId: 8, role: 'Member' }] },
        { teamId: 12, userRoles: [{ userId: 1, role: 'Leader' },] },
        { teamId: 13, userRoles: [{ userId: 8, role: 'Leader' }, { userId: 5, role: 'Member' }] },
        { teamId: 14, userRoles: [{ userId: 8, role: 'Leader' },] },
    ];

    await Promise.all(
        userTeams.map(async (userTeam) => {
            const team = await prisma.team.findUnique({
                where: { id: userTeam.teamId },
            });

            if (team) {
                await Promise.all(
                    userTeam.userRoles.map(async (userRole) => {
                        await prisma.userTeam.upsert({
                            where: {
                                userId_teamId: {
                                    userId: userRole.userId,
                                    teamId: team.id,
                                },
                            },
                            update: {},
                            create: {
                                teamId: team.id,
                                userId: userRole.userId,
                                role: userRole.role
                            },
                        });
                    })
                );
            }
        })
    );


    const messages = [
        // team 3
        { id: 1, text: "Hey guys, are we still on for the 5 PM practice today?", userId: 6, teamId: 3 },
        { id: 2, text: "Yeah, I’m in! Can’t wait to test out my new cleats.", userId: 7, teamId: 3 },
        { id: 3, text: "Same here. Should we meet by the north field?", userId: 8, teamId: 3 },
        { id: 4, text: "Agreed. I'll bring the cones for warm-up drills.", userId: 6, teamId: 3 },
        { id: 5, text: "Hey team, any update on this week’s game?", userId: 1, teamId: 3 },
        { id: 6, text: "Still waiting on the final schedule, but let's be prepared.", userId: 7, teamId: 3 },
        { id: 7, text: "I'll bring the jerseys!", userId: 6, teamId: 3 },
        { id: 8, text: "Can anyone take care of the refreshments for practice?", userId: 1, teamId: 3 },
        { id: 9, text: "I can bring some snacks! What do you guys prefer?", userId: 5, teamId: 3 },
        { id: 10, text: "Let’s plan for a scrimmage game at practice today!", userId: 6, teamId: 3 },
        { id: 11, text: "Awesome! I’ll get the extra balls we need.", userId: 7, teamId: 3 },
        { id: 12, text: "Who’s going to be our goalie this time?", userId: 8, teamId: 3 },
        { id: 13, text: "I’ll volunteer! Just need to warm up first.", userId: 6, teamId: 3 },
        { id: 14, text: "Let’s make sure to communicate well on the field today.", userId: 1, teamId: 3 },
        { id: 15, text: "Definitely! Communication is key!", userId: 5, teamId: 3 },
        { id: 16, text: "Should we start the practice with some drills?", userId: 7, teamId: 3 },
        { id: 17, text: "Good idea! Let’s do some passing drills first.", userId: 6, teamId: 3 },
        { id: 18, text: "I can lead the passing drills if you'd like.", userId: 8, teamId: 3 },
        { id: 19, text: "What time are we all meeting?", userId: 1, teamId: 3 },
        { id: 20, text: "Let’s meet 15 minutes early to warm up!", userId: 7, teamId: 3 },
        { id: 21, text: "How's everyone's fitness level? Ready to hustle?", userId: 6, teamId: 3 },
        { id: 22, text: "I’ve been hitting the gym! Let’s go!", userId: 8, teamId: 3 },
        { id: 23, text: "I can do better on my fitness. Let's motivate each other!", userId: 5, teamId: 3 },
        { id: 24, text: "What about practicing some corner kicks today?", userId: 6, teamId: 3 },
        { id: 25, text: "Sounds good! I’ll take care of those.", userId: 7, teamId: 3 },
        { id: 26, text: "Are we playing against the other team next week?", userId: 1, teamId: 3 },
        { id: 27, text: "Yes! We need to step up our game.", userId: 8, teamId: 3 },
        { id: 28, text: "What time is our game next week?", userId: 5, teamId: 3 },
        { id: 29, text: "I think it's at 3 PM on Saturday.", userId: 6, teamId: 3 },
        { id: 30, text: "Let’s have a meeting before the game to finalize our strategy.", userId: 7, teamId: 3 },
        { id: 31, text: "I can set that up! How about Friday evening?", userId: 1, teamId: 3 },
        { id: 32, text: "Perfect! Let’s review our formations.", userId: 5, teamId: 3 },
        { id: 33, text: "I can bring a projector for the strategy session.", userId: 6, teamId: 3 },
        { id: 34, text: "Great idea! Visual aids always help.", userId: 8, teamId: 3 },
        { id: 35, text: "Should we create a group chat for our team updates?", userId: 7, teamId: 3 },
        { id: 36, text: "Yes! That’ll keep us all in the loop.", userId: 1, teamId: 3 },
        { id: 37, text: "I'll set it up on WhatsApp.", userId: 5, teamId: 3 },
        { id: 38, text: "Thanks! Can’t wait to share all the updates.", userId: 6, teamId: 3 },
        { id: 39, text: "Let’s share tips and resources there too.", userId: 7, teamId: 3 },
        { id: 40, text: "Sounds good! I found a great video on techniques.", userId: 8, teamId: 3 },
        { id: 41, text: "Let’s all commit to improving our skills this week!", userId: 1, teamId: 3 },
        { id: 42, text: "Agreed! Consistency is key.", userId: 5, teamId: 3 },
        { id: 43, text: "I’ll share my workout routine if anyone’s interested.", userId: 6, teamId: 3 },
        { id: 44, text: "Please do! I’m looking to step up my game.", userId: 7, teamId: 3 },
        { id: 45, text: "I’m working on my shooting accuracy this week.", userId: 8, teamId: 3 },
        { id: 46, text: "Let’s also work on set pieces during practice.", userId: 6, teamId: 3 },
        { id: 47, text: "Good call! We should practice penalties too.", userId: 1, teamId: 3 },
        { id: 48, text: "I can stay late for extra practice if needed.", userId: 5, teamId: 3 },
        { id: 49, text: "I’m down for that! Let’s take advantage of the extra time.", userId: 7, teamId: 3 },
        { id: 50, text: "How about a friendly match this weekend?", userId: 8, teamId: 3 },
        { id: 51, text: "I’d love that! Let’s organize it.", userId: 6, teamId: 3 },
        { id: 52, text: "We should invite some other teams to join!", userId: 1, teamId: 3 },
        { id: 53, text: "That could be fun! Let’s get some more people involved.", userId: 5, teamId: 3 },
        { id: 54, text: "I’ll check if my friends can come too.", userId: 7, teamId: 3 },
        { id: 55, text: "I can bring refreshments for everyone if we do.", userId: 8, teamId: 3 },
        { id: 56, text: "This is shaping up to be a great weekend!", userId: 6, teamId: 3 },
        { id: 57, text: "Looking forward to the match!", userId: 1, teamId: 3 },
        { id: 58, text: "I’ll make sure to bring my A-game!", userId: 5, teamId: 3 },
        { id: 59, text: "Let’s take it easy during the practice before the game.", userId: 7, teamId: 3 },
        { id: 60, text: "I’ll do my best to stay calm and focused.", userId: 8, teamId: 3 },
        { id: 61, text: "Any last-minute strategies we want to discuss?", userId: 1, teamId: 3 },
        { id: 62, text: "Let’s review our formation once more.", userId: 5, teamId: 3 },
        { id: 63, text: "I’m open to suggestions on how to improve our play.", userId: 6, teamId: 3 },
        { id: 64, text: "Communication is vital; let’s keep talking on the field.", userId: 7, teamId: 3 },
        { id: 65, text: "Agreed! We need to stay coordinated.", userId: 8, teamId: 3 },
        { id: 66, text: "I’m sure we’ll do great if we stick together.", userId: 1, teamId: 3 },
        { id: 67, text: "Let’s keep the morale high and support each other!", userId: 5, teamId: 3 },
        { id: 68, text: "No negativity on the field; only positive vibes!", userId: 6, teamId: 3 },
        { id: 69, text: "Let’s enjoy the game, win or lose!", userId: 7, teamId: 3 },
        { id: 70, text: "Absolutely! It’s all about having fun!", userId: 8, teamId: 3 },
        { id: 71, text: "Can’t wait to see everyone at practice!", userId: 1, teamId: 3 },
        { id: 72, text: "Let’s make this season unforgettable!", userId: 5, teamId: 3 },
        { id: 73, text: "We’ve got this, team! Let’s go!", userId: 6, teamId: 3 },
        { id: 74, text: "Count me in for every practice!", userId: 7, teamId: 3 },
        { id: 75, text: "Together we’ll achieve our goals!", userId: 8, teamId: 3 },
        { id: 76, text: "Hey everyone, I’m feeling pumped for today’s practice!", userId: 1, teamId: 3 },
        { id: 77, text: "Let’s show our progress at practice today!", userId: 5, teamId: 3 },
        { id: 78, text: "I’m ready to push myself harder this week!", userId: 6, teamId: 3 },
        { id: 79, text: "Who’s excited for the game this weekend?", userId: 7, teamId: 3 },
        { id: 80, text: "Let’s put our best foot forward!", userId: 8, teamId: 3 },

        // team 4
        { id: 8, text: "What’s the game plan for Friday’s match?", userId: 1, teamId: 4 },
        { id: 9, text: "We should focus on defense first, and then counter-attack.", userId: 6, teamId: 4 },
        { id: 10, text: "I'll make sure we practice those setups at tomorrow's session.", userId: 1, teamId: 4 },
        { id: 11, text: "Anyone up for a practice session tomorrow?", userId: 6, teamId: 4 },
        { id: 12, text: "I can make it in the afternoon.", userId: 8, teamId: 4 },
        { id: 13, text: "Same here. Let’s finalize the time later.", userId: 7, teamId: 4 },
        { id: 14, text: "Let’s work on our batting order for the match.", userId: 1, teamId: 4 },
        { id: 15, text: "I think we should have our strongest batsman up first.", userId: 5, teamId: 4 },
        { id: 16, text: "What about our bowling strategy?", userId: 6, teamId: 4 },
        { id: 17, text: "I suggest we start with spin bowlers in the first overs.", userId: 7, teamId: 4 },
        { id: 18, text: "That could really help in slowing down their scoring.", userId: 8, teamId: 4 },
        { id: 19, text: "Let’s also practice some fielding drills to sharpen our skills.", userId: 1, teamId: 4 },
        { id: 20, text: "Good idea! We need to minimize dropped catches.", userId: 6, teamId: 4 },
        { id: 21, text: "Should we have a wicketkeeper ready for this match?", userId: 7, teamId: 4 },
        { id: 22, text: "Yes, I can handle wicketkeeping.", userId: 5, teamId: 4 },
        { id: 23, text: "What time should we meet before the game?", userId: 1, teamId: 4 },
        { id: 24, text: "Let’s aim to meet an hour before the match.", userId: 8, teamId: 4 },
        { id: 25, text: "I’ll bring the drinks for the game!", userId: 6, teamId: 4 },
        { id: 26, text: "Thanks! Hydration is key for our performance.", userId: 7, teamId: 4 },
        { id: 27, text: "Let’s also keep an eye on the weather forecast.", userId: 1, teamId: 4 },
        { id: 28, text: "It looks like it might rain; we should have a backup plan.", userId: 5, teamId: 4 },
        { id: 29, text: "How are we feeling about our last practice session?", userId: 6, teamId: 4 },
        { id: 30, text: "I think we need to tighten our bowling a bit more.", userId: 8, teamId: 4 },
        { id: 31, text: "I agree! We should practice our yorkers.", userId: 7, teamId: 4 },
        { id: 32, text: "How about we set a specific fielding formation for the match?", userId: 1, teamId: 4 },
        { id: 33, text: "I can lead that discussion during practice.", userId: 5, teamId: 4 },
        { id: 34, text: "Let’s also decide on our batting partnerships.", userId: 6, teamId: 4 },
        { id: 35, text: "Good call! Communication is crucial on the field.", userId: 7, teamId: 4 },
        { id: 36, text: "I’m excited to see our new strategies in action.", userId: 8, teamId: 4 },
        { id: 37, text: "What’s everyone’s focus for this match?", userId: 1, teamId: 4 },
        { id: 38, text: "I’m going to focus on my bowling accuracy.", userId: 5, teamId: 4 },
        { id: 39, text: "I’ll concentrate on my batting timing.", userId: 6, teamId: 4 },
        { id: 40, text: "I need to work on my running between the wickets.", userId: 7, teamId: 4 },
        { id: 41, text: "Let’s remind each other to call for runs clearly.", userId: 8, teamId: 4 },
        { id: 42, text: "Should we review some footage of our last game?", userId: 1, teamId: 4 },
        { id: 43, text: "That’s a great idea! We can learn from our mistakes.", userId: 6, teamId: 4 },
        { id: 44, text: "I’ll bring my laptop to the next practice for that.", userId: 5, teamId: 4 },
        { id: 45, text: "Perfect! Visualizing our play will help.", userId: 7, teamId: 4 },
        { id: 46, text: "Let’s keep our spirits high, regardless of the match outcome.", userId: 8, teamId: 4 },
        { id: 47, text: "Absolutely! It’s all about enjoying the game.", userId: 1, teamId: 4 },
        { id: 48, text: "We’ll perform better when we have fun out there.", userId: 5, teamId: 4 },
        { id: 49, text: "I believe in our team; we’ve got this!", userId: 6, teamId: 4 },
        { id: 50, text: "What’s our target score for Friday’s match?", userId: 7, teamId: 4 },
        { id: 51, text: "I think 200 runs should be a good target.", userId: 1, teamId: 4 },
        { id: 52, text: "That’s achievable if we start strong.", userId: 8, teamId: 4 },
        { id: 53, text: "Let’s discuss our batting strategies in detail.", userId: 5, teamId: 4 },
        { id: 54, text: "I can work on some drills to improve our running.", userId: 6, teamId: 4 },
        { id: 55, text: "Should we include power hitting in our training?", userId: 7, teamId: 4 },
        { id: 56, text: "Definitely! It can give us the edge we need.", userId: 8, teamId: 4 },
        { id: 57, text: "Let’s do some simulations for match scenarios.", userId: 1, teamId: 4 },
        { id: 58, text: "I’m excited to try out new strategies!", userId: 5, teamId: 4 },
        { id: 59, text: "Any thoughts on who should bowl in the death overs?", userId: 6, teamId: 4 },
        { id: 60, text: "I think our fast bowlers should take that role.", userId: 7, teamId: 4 },
        { id: 61, text: "Let’s make sure everyone is clear on their roles.", userId: 8, teamId: 4 },
        { id: 62, text: "What’s everyone’s plan for warming up before the match?", userId: 1, teamId: 4 },
        { id: 63, text: "I’d like to start with some stretches and light running.", userId: 5, teamId: 4 },
        { id: 64, text: "We should also include some catching drills.", userId: 6, teamId: 4 },
        { id: 65, text: "Yes, let’s keep our reflexes sharp!", userId: 7, teamId: 4 },
        { id: 66, text: "I’m looking forward to Friday’s match!", userId: 8, teamId: 4 },
        { id: 67, text: "Let’s give it our all and enjoy the game.", userId: 1, teamId: 4 },
        { id: 68, text: "Together, we can achieve great things!", userId: 5, teamId: 4 },
        { id: 69, text: "Can’t wait to see everyone on the field!", userId: 6, teamId: 4 },
        { id: 70, text: "Let’s make this match one to remember!", userId: 7, teamId: 4 },
        { id: 71, text: "We’ll make it a great experience, win or lose.", userId: 8, teamId: 4 },

        // team 5
        { id: 14, text: "What’s the strategy for the upcoming tournament?", userId: 6, teamId: 5 },
        { id: 15, text: "We should focus on counter-attacks, especially with fast breaks.", userId: 5, teamId: 5 },
        { id: 16, text: "Agreed, I’ve been practicing those plays all week.", userId: 8, teamId: 5 },
        { id: 17, text: "Nice! Let’s also tighten up our defense.", userId: 6, teamId: 5 },
        { id: 18, text: "I’ll review the game footage to identify weak spots.", userId: 7, teamId: 5 },
        { id: 19, text: "Good idea. Let’s have a strategy session before our next practice.", userId: 8, teamId: 5 },
        { id: 20, text: "I'll bring snacks for the strategy session, don’t worry!", userId: 6, teamId: 5 },
        { id: 21, text: "Let’s work on our serves; they need to be on point.", userId: 1, teamId: 5 },
        { id: 22, text: "I’ve been practicing my spin serves; they should help.", userId: 5, teamId: 5 },
        { id: 23, text: "I think our return game needs some focus too.", userId: 8, teamId: 5 },
        { id: 24, text: "Absolutely! Let’s partner up during practice for that.", userId: 6, teamId: 5 },
        { id: 25, text: "Should we try some drills focusing on doubles strategies?", userId: 7, teamId: 5 },
        { id: 26, text: "Great idea! Communication is key in doubles.", userId: 1, teamId: 5 },
        { id: 27, text: "I can lead a few drills for that.", userId: 5, teamId: 5 },
        { id: 28, text: "Let’s also incorporate some footwork exercises.", userId: 6, teamId: 5 },
        { id: 29, text: "Good thinking! Footwork can really make a difference.", userId: 8, teamId: 5 },
        { id: 30, text: "We should have a session dedicated to match scenarios.", userId: 1, teamId: 5 },
        { id: 31, text: "Definitely! That will help us think on our feet.", userId: 5, teamId: 5 },
        { id: 32, text: "What’s everyone’s focus area for the next practice?", userId: 6, teamId: 5 },
        { id: 33, text: "I’m focusing on my backhand; it needs some work.", userId: 7, teamId: 5 },
        { id: 34, text: "I’ll work on my net play.", userId: 8, teamId: 5 },
        { id: 35, text: "Let’s remind each other to stay positive during drills.", userId: 1, teamId: 5 },
        { id: 36, text: "Absolutely! A positive mindset helps a lot.", userId: 5, teamId: 5 },
        { id: 37, text: "I’ll share some resources on effective tennis strategies.", userId: 6, teamId: 5 },
        { id: 38, text: "Great! I’d love to see those.", userId: 8, teamId: 5 },
        { id: 39, text: "Let’s discuss our formations for doubles play.", userId: 1, teamId: 5 },
        { id: 40, text: "That’s a great idea! It’ll help us coordinate better.", userId: 5, teamId: 5 },
        { id: 41, text: "How about we do a mock tournament to practice?", userId: 6, teamId: 5 },
        { id: 42, text: "Yes! It’ll be a fun way to gauge our progress.", userId: 7, teamId: 5 },
        { id: 43, text: "What day works for everyone to do that?", userId: 8, teamId: 5 },
        { id: 44, text: "I’m free on Saturday afternoon.", userId: 1, teamId: 5 },
        { id: 45, text: "Same here! Let’s finalize a time.", userId: 5, teamId: 5 },
        { id: 46, text: "Let’s keep our energy high during practices!", userId: 6, teamId: 5 },
        { id: 47, text: "Definitely! A lively atmosphere boosts morale.", userId: 8, teamId: 5 },
        { id: 48, text: "I’ll bring some music for our next session.", userId: 1, teamId: 5 },
        { id: 49, text: "That would be awesome! Let’s enjoy the training.", userId: 5, teamId: 5 },
        { id: 50, text: "How do we feel about our current fitness levels?", userId: 6, teamId: 5 },
        { id: 51, text: "I think we could all benefit from some extra cardio.", userId: 7, teamId: 5 },
        { id: 52, text: "I can lead a warm-up session next practice.", userId: 8, teamId: 5 },
        { id: 53, text: "Let’s also do some strength training!", userId: 1, teamId: 5 },
        { id: 54, text: "Agreed! A strong body supports a strong game.", userId: 5, teamId: 5 },
        { id: 55, text: "What do you think about our serve-and-volley strategy?", userId: 6, teamId: 5 },
        { id: 56, text: "It can be very effective if executed well.", userId: 7, teamId: 5 },
        { id: 57, text: "Let’s practice it more during drills.", userId: 8, teamId: 5 },
        { id: 58, text: "Should we schedule a friendly match with another team?", userId: 1, teamId: 5 },
        { id: 59, text: "That could be a great way to apply our strategies!", userId: 5, teamId: 5 },
        { id: 60, text: "I’m excited to see how we perform against others.", userId: 6, teamId: 5 },
        { id: 61, text: "Let’s keep our focus on teamwork throughout.", userId: 7, teamId: 5 },
        { id: 62, text: "Absolutely! Communication is vital on the court.", userId: 8, teamId: 5 },
        { id: 63, text: "How does everyone feel about our chances in the tournament?", userId: 1, teamId: 5 },
        { id: 64, text: "I believe we have a solid shot at it!", userId: 5, teamId: 5 },
        { id: 65, text: "We just need to stick to our plan.", userId: 6, teamId: 5 },
        { id: 66, text: "And maintain a strong team spirit!", userId: 7, teamId: 5 },
        { id: 67, text: "Let’s make sure we celebrate our successes, no matter how small.", userId: 8, teamId: 5 },
        { id: 68, text: "Definitely! Each step forward is a win.", userId: 1, teamId: 5 },
        { id: 69, text: "What are we planning for our warm-up before the tournament?", userId: 5, teamId: 5 },
        { id: 70, text: "I suggest some light stretching and a few practice serves.", userId: 6, teamId: 5 },
        { id: 71, text: "Let’s remember to hydrate before the matches too!", userId: 7, teamId: 5 },
        { id: 72, text: "Looking forward to it! Let’s bring our A-game.", userId: 8, teamId: 5 },

        //team 6
        { id: 21, text: "Who’s up for a quick practice after work today?", userId: 7, teamId: 6 },
        { id: 22, text: "Count me in! We need to tighten up our defense at the net.", userId: 8, teamId: 6 },
        { id: 23, text: "Agreed. Let's meet at 6 PM for a quick session.", userId: 7, teamId: 6 },
        { id: 24, text: "Hey team, let’s meet early tomorrow for extra practice.", userId: 6, teamId: 6 },
        { id: 25, text: "Sure! I’ll be there by 7 AM.", userId: 8, teamId: 6 },
        { id: 26, text: "Same here. What should we focus on?", userId: 7, teamId: 6 },
        { id: 27, text: "Let's work on our jump shots and passing accuracy.", userId: 6, teamId: 6 },
        { id: 28, text: "Great, I'll set up some drills for passing.", userId: 8, teamId: 6 },
        { id: 29, text: "Let’s also run a few scrimmages to simulate game conditions.", userId: 6, teamId: 6 },
        { id: 30, text: "I’m excited for tomorrow. Let's make it count!", userId: 7, teamId: 6 },

    ];

    for (const msg of messages) {
        await prisma.message.create({
            data: {
                text: msg.text,
                userId: msg.userId,
                teamId: msg.teamId
            }
        });
    }

    const venues = [
        {
            id: 1,
            name: 'Paschim Vihar Sports Complex',
            address: 'A6, Paschim Vihar, New Delhi, 110063',
            phone: '011-4500-1234',
            sports: ['Cricket', 'Basketball', 'Tennis', 'Volleyball'],
            slots: [{
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T10:00:00Z'),
                endTime: new Date('2024-11-08T12:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T12:00:00Z'),
                endTime: new Date('2024-11-08T14:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T17:00:00Z'),
                endTime: new Date('2024-11-08T19:00:00Z')
            },
            ]
        },
        {
            id: 2,
            name: 'Rohini Tennis Club',
            address: 'Sector-15, Rohini, New Delhi, 110085',
            phone: '011-2765-9876',
            sports: ['Tennis'],
            slots: [{
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T10:00:00Z'),
                endTime: new Date('2024-11-08T12:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T12:00:00Z'),
                endTime: new Date('2024-11-08T14:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T17:00:00Z'),
                endTime: new Date('2024-11-08T19:00:00Z')
            },
            ]
        },
        {
            id: 3,
            name: 'Dwarka Bowling Arena',
            address: 'Sector-6, Dwarka, New Delhi, 110075',
            phone: '011-2805-1111',
            sports: ['Bowling'],
            slots: [{
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T10:00:00Z'),
                endTime: new Date('2024-11-08T12:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T12:00:00Z'),
                endTime: new Date('2024-11-08T14:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T17:00:00Z'),
                endTime: new Date('2024-11-08T19:00:00Z')
            },
            ]
        },
        {
            id: 4,
            name: 'Pacific Sports Complex',
            address: 'P3PV+794, Pocket 10, Sector 25, Rohini, Delhi, 110085',
            phone: '011-2805-1111',
            sports: ['Swimming', 'Gymnastics','Aerobics',],
            slots: [{
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T10:00:00Z'),
                endTime: new Date('2024-11-08T12:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T12:00:00Z'),
                endTime: new Date('2024-11-08T14:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T17:00:00Z'),
                endTime: new Date('2024-11-08T19:00:00Z')
            },
            ]
        },
        {
            id: 5,
            name: 'Rohini Sports Complex',
            address: 'Sector -14, Rohini, Delhi - 110 085 (Near CRPF School)',
            phone: '27561986',
            sports: ['Badminton', 'Basketball','Football',],
            slots: [{
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T10:00:00Z'),
                endTime: new Date('2024-11-08T12:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T12:00:00Z'),
                endTime: new Date('2024-11-08T14:00:00Z')
            },
            {
                date: new Date('2024-11-12T00:00:00Z'),
                startTime: new Date('2024-11-08T17:00:00Z'),
                endTime: new Date('2024-11-08T19:00:00Z')
            },
            ]
        },
    ];

    for (const venue of venues) {
        const createdVenue = await prisma.venue.create({
            data: {
                name: venue.name,
                address: venue.address,
                phone: venue.phone,
                sports: {
                    connectOrCreate: await Promise.all(
                        venue.sports.map(async (hobbyName)=>{
                            let hobby = await prisma.hobby.findUnique({
                                where: {name: hobbyName}
                            });
                            
                            if(!hobby){
                                hobby = await prisma.hobby.create({
                                    data: {name: hobbyName}
                                })
                            }

                            return {
                                where: {
                                    venueId_hobbyId: {
                                        venueId: venue.id, 
                                        hobbyId: hobby.id,
                                    },
                                },
                                create: {
                                    hobby: { connect: { id: hobby.id } },
                                },
                            };
                        })
                    )
                }
            },
        });

        await Promise.all(
            venue.slots.map(async (slot) => {
                await prisma.venueSlot.create({
                    data: {
                        date: slot.date,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        venueId: createdVenue.id,
                    }
                });
            })
        );
    }

    console.log('Seed data inserted');
}

main()
    .catch(e => {
        console.error(e);
    })