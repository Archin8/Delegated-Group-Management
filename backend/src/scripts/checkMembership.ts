import { AppDataSource } from '../config/database';
import { GroupMember } from '../entities/GroupMember';
import { User } from '../entities/User';

async function checkMembership() {
  try {
    await AppDataSource.initialize();
    
    const email = process.argv[2];
    const groupId = process.argv[3];

    if (!email || !groupId) {
      console.error('Please provide email and groupId as arguments');
      process.exit(1);
    }

    // Find user by email
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    // Find group membership
    const memberRepository = AppDataSource.getRepository(GroupMember);
    const member = await memberRepository.findOne({
      where: { userId: user.id, groupId },
      relations: ['role'],
    });

    if (!member) {
      console.error('User is not a member of this group');
      process.exit(1);
    }

    console.log('Membership found:');
    console.log('User:', user.email);
    console.log('Role:', member.role.name);
    console.log('Permissions:', member.role.permissions);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMembership(); 