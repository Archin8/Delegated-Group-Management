import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { Role } from '../entities/Role';
import { GroupMember } from '../entities/GroupMember';
import { Permission } from '../types';

async function grantAllPermissions(userEmail: string) {
  try {
    await AppDataSource.initialize();

    // Find the user
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: userEmail } });

    if (!user) {
      console.error('User not found');
      return;
    }

    // Get all groups
    const groupRepository = AppDataSource.getRepository(Group);
    const groups = await groupRepository.find();

    // For each group, create a role with all permissions and assign it to the user
    for (const group of groups) {
      // Create a role with all permissions
      const roleRepository = AppDataSource.getRepository(Role);
      const role = roleRepository.create({
        name: 'Super Admin',
        groupId: group.id,
        permissions: Object.values(Permission),
        priority: 999, // Highest priority
      });
      await roleRepository.save(role);

      // Create group membership
      const memberRepository = AppDataSource.getRepository(GroupMember);
      const member = memberRepository.create({
        userId: user.id,
        groupId: group.id,
        roleId: role.id,
      });
      await memberRepository.save(member);

      console.log(`Granted all permissions in group: ${group.name}`);
    }

    console.log('Successfully granted all permissions');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Get email from command line argument
const userEmail = process.argv[2];
if (!userEmail) {
  console.error('Please provide a user email as an argument');
  process.exit(1);
}

grantAllPermissions(userEmail); 