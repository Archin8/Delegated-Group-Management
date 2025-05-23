import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

async function makeAdmin(userEmail: string) {
  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: userEmail } });

    if (!user) {
      console.error('User not found');
      return;
    }

    user.isAdmin = true;
    await userRepository.save(user);

    console.log(`Successfully made ${userEmail} an admin`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

makeAdmin(email); 