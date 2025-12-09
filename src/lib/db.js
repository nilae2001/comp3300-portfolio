import 'server-only';
import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

const databaseUrl = process.env.NEON_DB_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Set it in your environment to use the database.');
}

const sql = neon(databaseUrl);

const HERO_PLACEHOLDER_AVATAR = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: 'Nila Erturk',
  shortDescription: 'Software Developer',
  longDescription:
    "Hello! I'm Nila, and I am Full Stack Web Developer",
};

const seedProjects = [
  
  {
    id: randomUUID(),
    title: 'Project Four',
    description: 'Description for project four.',
    img: 'https://placehold.co/300.png',
    link: '#',
    keywords: ['Keyword1', 'Keyword2'],
  },
  {
    id: randomUUID(),
    title: 'Project Five',
    description: 'Description for project five.',
    img: 'https://placehold.co/300.png',
    link: '#',
    keywords: ['Keyword1', 'Keyword2'],
  },
  {
    id: randomUUID(),
    title: 'Project Six',
    description: 'Description for project six.',
    img: 'https://placehold.co/300.png',
    link: '#',
    keywords: ['Keyword1', 'Keyword2'],
  },
  {
    id: randomUUID(),
    title: 'Project Seven',
    description: 'Description for project seven.',
    img: 'https://placehold.co/300.png',
    link: '#',
    keywords: ['Keyword1', 'Keyword2'],
  },
];

async function ensureProjectsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      img text NOT NULL,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM projects`;
  if (Number(count) === 0) {
    await seedProjectsTable();
  }
}

async function seedProjectsTable() {
  for (const project of seedProjects) {
    await sql`
      INSERT INTO projects (id, title, description, img, link, keywords)
      VALUES (
        ${project.id}::uuid,
        ${project.title},
        ${project.description},
        ${project.img},
        ${project.link},
        ${JSON.stringify(normalizeKeywordsInput(project.keywords))}::jsonb
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

function normalizeKeywordsInput(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  return list
    .map((keyword) => keyword?.toString().trim())
    .filter((keyword) => Boolean(keyword));
}

const PROJECT_STRING_FIELDS = ['title', 'description', 'img', 'link'];

function pickProjectFields(input = {}) {
  return PROJECT_STRING_FIELDS.reduce((acc, field) => {
    if (input[field] !== undefined) {
      const value = input[field];
      acc[field] = typeof value === 'string' ? value.trim() : value;
    }
    return acc;
  }, {});
}

function mapProjectRow(row) {
  return {
    ...row,
    keywords: Array.isArray(row.keywords)
      ? row.keywords
      : normalizeKeywordsInput(row.keywords),
  };
}

export async function fetchProjects() {
  await ensureProjectsTable();
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    ORDER BY created_at DESC
  `;

  return rows.map(mapProjectRow);
}

export async function getProjectById(id) {
  await ensureProjectsTable();
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  return mapProjectRow(rows[0]);
}

export async function insertProject(project) {
  await ensureProjectsTable();
  const id = project.id ?? randomUUID();
  const keywords = normalizeKeywordsInput(project.keywords);

  const [row] = await sql`
    INSERT INTO projects (id, title, description, img, link, keywords)
    VALUES (
      ${id}::uuid,
      ${project.title},
      ${project.description},
      ${project.img},
      ${project.link},
      ${JSON.stringify(keywords)}::jsonb
    )
    RETURNING
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapProjectRow(row);
}

export async function updateProject(id, updates = {}) {
  await ensureProjectsTable();
  const currentRows = await sql`
    SELECT
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  if (currentRows.length === 0) {
    return null;
  }

  const current = mapProjectRow(currentRows[0]);
  const sanitized = pickProjectFields(updates);
  const nextKeywords =
    updates.keywords !== undefined
      ? normalizeKeywordsInput(updates.keywords)
      : current.keywords;

  const payload = {
    title: sanitized.title ?? current.title,
    description: sanitized.description ?? current.description,
    img: sanitized.img ?? current.img,
    link: sanitized.link ?? current.link,
    keywords: nextKeywords,
  };

  const [row] = await sql`
    UPDATE projects
    SET
      title = ${payload.title},
      description = ${payload.description},
      img = ${payload.img},
      link = ${payload.link},
      keywords = ${JSON.stringify(payload.keywords)}::jsonb,
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapProjectRow(row);
}

export async function deleteProject(id) {
  await ensureProjectsTable();
  const rows = await sql`
    DELETE FROM projects
    WHERE id = ${id}::uuid
    RETURNING
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  if (rows.length === 0) {
    return null;
  }

  return mapProjectRow(rows[0]);
}

function pickHeroFields(input = {}) {
  const payload = {};
  if (input.avatar !== undefined) {
    const trimmed = typeof input.avatar === 'string' ? input.avatar.trim() : input.avatar;
    if (trimmed) {
      payload.avatar = trimmed;
    }
  }
  if (input.fullName !== undefined) {
    const trimmed = typeof input.fullName === 'string' ? input.fullName.trim() : input.fullName;
    if (trimmed) {
      payload.fullName = trimmed;
    }
  }
  if (input.shortDescription !== undefined) {
    const trimmed =
      typeof input.shortDescription === 'string'
        ? input.shortDescription.trim()
        : input.shortDescription;
    if (trimmed && trimmed.length > 120) {
      throw new Error('Short description must be at most 120 characters long.');
    }
    if (trimmed) {
      payload.shortDescription = trimmed;
    }
  }
  if (input.longDescription !== undefined) {
    const trimmed =
      typeof input.longDescription === 'string' ? input.longDescription.trim() : input.longDescription;
    if (trimmed) {
      payload.longDescription = trimmed;
    }
  }

  return payload;
}

function mapHeroRow(row = {}) {
  const avatar = typeof row.avatar === 'string' ? row.avatar.trim() : row.avatar;
  const fullName = row.fullName ?? row.full_name;
  const shortDescription = row.shortDescription ?? row.short_description;
  const longDescription = row.longDescription ?? row.long_description;

  return {
    id: row.id,
    avatar: avatar && avatar.length > 0 ? avatar : HERO_PLACEHOLDER_AVATAR,
    fullName: (typeof fullName === 'string' ? fullName.trim() : fullName) ?? defaultHeroContent.fullName,
    shortDescription:
      (typeof shortDescription === 'string' ? shortDescription.trim() : shortDescription) ??
      defaultHeroContent.shortDescription,
    longDescription:
      (typeof longDescription === 'string' ? longDescription.trim() : longDescription) ??
      defaultHeroContent.longDescription,
    createdAt: row.createdAt ?? row.created_at,
    updatedAt: row.updatedAt ?? row.updated_at,
  };
}

async function ensureHeroTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS hero (
      id uuid PRIMARY KEY,
      avatar text NOT NULL DEFAULT '',
      full_name text NOT NULL,
      short_description text NOT NULL CHECK (char_length(short_description) <= 120),
      long_description text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM hero`;
  if (Number(count) === 0) {
    await seedHeroTable();
  }
}

async function seedHeroTable() {
  const id = randomUUID();
  const payload = { ...defaultHeroContent };

  await sql`
    INSERT INTO hero (id, avatar, full_name, short_description, long_description)
    VALUES (
      ${id}::uuid,
      ${payload.avatar},
      ${payload.fullName},
      ${payload.shortDescription},
      ${payload.longDescription}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function getHero() {
  await ensureHeroTable();
  const rows = await sql`
    SELECT
      id,
      avatar,
      full_name,
      short_description,
      long_description,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM hero
    ORDER BY created_at ASC
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  return mapHeroRow(rows[0]);
}

export async function insertHero(hero = {}) {
  await ensureHeroTable();
  const payload = { ...defaultHeroContent, ...pickHeroFields(hero) };
  const avatar =
    typeof payload.avatar === 'string' && payload.avatar.trim().length === 0
      ? HERO_PLACEHOLDER_AVATAR
      : payload.avatar;
  const id = hero.id ?? randomUUID();

  const [row] = await sql`
    INSERT INTO hero (id, avatar, full_name, short_description, long_description)
    VALUES (
      ${id}::uuid,
      ${avatar},
      ${payload.fullName},
      ${payload.shortDescription},
      ${payload.longDescription}
    )
    ON CONFLICT (id) DO UPDATE
    SET
      avatar = EXCLUDED.avatar,
      full_name = EXCLUDED.full_name,
      short_description = EXCLUDED.short_description,
      long_description = EXCLUDED.long_description,
      updated_at = now()
    RETURNING
      id,
      avatar,
      full_name AS "fullName",
      short_description AS "shortDescription",
      long_description AS "longDescription",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapHeroRow(row);
}

export async function upsertHero(updates = {}) {
  await ensureHeroTable();
  const current = await getHero();
  const sanitized = pickHeroFields(updates);

  if (!current) {
    return insertHero({ ...defaultHeroContent, ...sanitized });
  }

  const payload = {
    avatar: sanitized.avatar ?? current.avatar ?? HERO_PLACEHOLDER_AVATAR,
    fullName: sanitized.fullName ?? current.fullName ?? defaultHeroContent.fullName,
    shortDescription:
      sanitized.shortDescription ?? current.shortDescription ?? defaultHeroContent.shortDescription,
    longDescription:
      sanitized.longDescription ?? current.longDescription ?? defaultHeroContent.longDescription,
  };

  const normalizedAvatar =
    typeof payload.avatar === 'string' && payload.avatar.trim().length === 0
      ? HERO_PLACEHOLDER_AVATAR
      : payload.avatar;

  const [row] = await sql`
    UPDATE hero
    SET
      avatar = ${normalizedAvatar},
      full_name = ${payload.fullName},
      short_description = ${payload.shortDescription},
      long_description = ${payload.longDescription},
      updated_at = now()
    WHERE id = ${current.id}::uuid
    RETURNING
      id,
      avatar,
      full_name AS "fullName",
      short_description AS "shortDescription",
      long_description AS "longDescription",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapHeroRow(row);
}

export { fetchProjects as getProjects };