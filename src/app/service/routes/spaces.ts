import { AuthSession } from '../auth';
import { api } from '../api';
import { setActiveSpaceId } from '../active-space';
import { Space, SpaceMember } from '@/app/interfaces/Spaces';

const spacesRoute = '/spaces';
const spaceMembersRoute = '/space_members';

type SpaceResponse = Space | Space[] | null | undefined;
type SpaceMemberResponse = SpaceMember | SpaceMember[] | null | undefined;

function normalizeSpaces(response: SpaceResponse) {
  if (!response) return [];
  return Array.isArray(response) ? response : [response];
}

function normalizeSpaceMembers(response: SpaceMemberResponse) {
  if (!response) return [];
  return Array.isArray(response) ? response : [response];
}

function getUserDisplayName(session: AuthSession) {
  return (
    session.user.user_metadata?.name ||
    session.user.user_metadata?.full_name ||
    session.user.email ||
    'Usuário'
  );
}

async function getOwnedSpaces(session: AuthSession) {
  const { data } = await api.get<SpaceResponse>(spacesRoute, {
    params: {
      owner_id: `eq.${session.user.id}`,
      order: 'created_at.asc',
      limit: 1,
    },
  });

  return normalizeSpaces(data);
}

async function createDefaultSpace(session: AuthSession) {
  const { data } = await api.post<SpaceResponse>(
    spacesRoute,
    {
      name: 'Casa',
      owner_id: session.user.id,
    },
    {
      headers: {
        Prefer: 'return=representation',
      },
    },
  );

  return normalizeSpaces(data)[0];
}

async function ensureOwnerMember(space: Space, session: AuthSession) {
  const { data: members } = await api.get<SpaceMemberResponse>(spaceMembersRoute, {
    params: {
      space_id: `eq.${space.id}`,
      user_id: `eq.${session.user.id}`,
      limit: 1,
    },
  });
  const currentMember = normalizeSpaceMembers(members)[0];

  if (currentMember) return currentMember;

  const { data } = await api.post<SpaceMemberResponse>(
    spaceMembersRoute,
    {
      space_id: space.id,
      user_id: session.user.id,
      role: 'owner',
      display_name: getUserDisplayName(session),
    },
    {
      headers: {
        Prefer: 'return=representation',
      },
    },
  );

  return normalizeSpaceMembers(data)[0];
}

export async function ensureDefaultSpace(session: AuthSession) {
  const spaces = await getOwnedSpaces(session);
  const space = spaces[0] ?? (await createDefaultSpace(session));

  if (!space) {
    throw new Error('Não foi possível criar o espaço Casa.');
  }

  await ensureOwnerMember(space, session);
  setActiveSpaceId(space.id);

  return space;
}
