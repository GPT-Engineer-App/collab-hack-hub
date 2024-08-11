import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
});

import React from "react";

export function SupabaseProvider({ children }) {
    return children;
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### project_members

| name      | type                     | format | required |
|-----------|--------------------------|--------|----------|
| id        | int8                     | number | true     |
| project_id| int8                     | number | true     |
| user_id   | int8                     | number | true     |
| joined_at | timestamp with time zone | string | false    |

### tasks

| name      | type                     | format | required |
|-----------|--------------------------|--------|----------|
| id        | int8                     | number | true     |
| projectid | int8                     | number | true     |
| taskname  | text                     | string | false    |
| assignedto| int8                     | number | false    |
| status    | text                     | string | false    |
| duedate   | timestamp with time zone | string | false    |
| createdat | timestamp with time zone | string | false    |
| updatedat | timestamp with time zone | string | false    |

### content

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| project_id | int8                     | number | true     |
| title      | text                     | string | false    |
| content    | text                     | string | false    |
| tags       | text                     | string | false    |
| created_by | int8                     | number | false    |
| created_at | timestamp with time zone | string | false    |

### projects

| name        | type                     | format | required |
|-------------|--------------------------|--------|----------|
| id          | int8                     | number | true     |
| name        | text                     | string | false    |
| description | text                     | string | false    |
| createdby   | int8                     | number | false    |
| teammembers | int8[]                   | array  | false    |
| createdat   | timestamp with time zone | string | false    |
| updatedat   | timestamp with time zone | string | false    |

### collaborations

| name         | type                     | format | required |
|--------------|--------------------------|--------|----------|
| id           | int8                     | number | true     |
| projectid    | int8                     | number | true     |
| documentid   | int8                     | number | false    |
| content      | text                     | string | false    |
| lasteditedby | int8                     | number | false    |
| editedat     | timestamp with time zone | string | false    |

### comments

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| user_id    | int8                     | number | true     |
| content_id | int8                     | number | true     |
| text       | text                     | string | false    |
| created_at | timestamp with time zone | string | false    |

### ideas

| name        | type | format | required |
|-------------|------|--------|----------|
| id          | int8 | number | true     |
| project_id  | int8 | number | true     |
| user_id     | int8 | number | true     |
| title       | text | string | false    |
| description | text | string | false    |
| votes       | int8 | number | false    |

### users

| name           | type                     | format | required |
|----------------|--------------------------|--------|----------|
| id             | int8                     | number | true     |
| username       | text                     | string | false    |
| email          | text                     | string | false    |
| password       | text                     | string | false    |
| profilepicture | text                     | string | false    |
| skills         | text[]                   | array  | false    |
| createdat      | timestamp with time zone | string | false    |
| updatedat      | timestamp with time zone | string | false    |

### notifications

| name      | type                     | format  | required |
|-----------|--------------------------|---------|----------|
| id        | int8                     | number  | true     |
| userid    | int8                     | number  | true     |
| message   | text                     | string  | false    |
| isread    | boolean                  | boolean | false    |
| createdat | timestamp with time zone | string  | false    |

### team_members

| name       | type | format | required |
|------------|------|--------|----------|
| id         | int8 | number | true     |
| project_id | int8 | number | true     |
| name       | text | string | false    |
| role       | text | string | false    |

*/

// Hooks for project_members
export const useProjectMembers = () => useQuery({
    queryKey: ['project_members'],
    queryFn: () => fromSupabase(supabase.from('project_members').select('*'))
});

export const useAddProjectMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newMember) => fromSupabase(supabase.from('project_members').insert([newMember])),
        onSuccess: () => {
            queryClient.invalidateQueries(['project_members']);
        },
    });
};

// Hooks for tasks
export const useTasks = () => useQuery({
    queryKey: ['tasks'],
    queryFn: () => fromSupabase(supabase.from('tasks').select('*'))
});

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask) => fromSupabase(supabase.from('tasks').insert([newTask])),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });
};

// Hooks for content
export const useContent = () => useQuery({
    queryKey: ['content'],
    queryFn: () => fromSupabase(supabase.from('content').select('*'))
});

export const useAddContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newContent) => fromSupabase(supabase.from('content').insert([newContent])),
        onSuccess: () => {
            queryClient.invalidateQueries(['content']);
        },
    });
};

// Hooks for projects
export const useProjects = () => useQuery({
    queryKey: ['projects'],
    queryFn: () => fromSupabase(supabase.from('projects').select('*'))
});

export const useAddProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProject) => fromSupabase(supabase.from('projects').insert([newProject])),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });
};

// Hooks for collaborations
export const useCollaborations = () => useQuery({
    queryKey: ['collaborations'],
    queryFn: () => fromSupabase(supabase.from('collaborations').select('*'))
});

export const useAddCollaboration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCollaboration) => fromSupabase(supabase.from('collaborations').insert([newCollaboration])),
        onSuccess: () => {
            queryClient.invalidateQueries(['collaborations']);
        },
    });
};

// Hooks for comments
export const useComments = () => useQuery({
    queryKey: ['comments'],
    queryFn: () => fromSupabase(supabase.from('comments').select('*'))
});

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newComment) => fromSupabase(supabase.from('comments').insert([newComment])),
        onSuccess: () => {
            queryClient.invalidateQueries(['comments']);
        },
    });
};

// Hooks for ideas
export const useIdeas = () => useQuery({
    queryKey: ['ideas'],
    queryFn: () => fromSupabase(supabase.from('ideas').select('*'))
});

export const useAddIdea = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newIdea) => fromSupabase(supabase.from('ideas').insert([newIdea])),
        onSuccess: () => {
            queryClient.invalidateQueries(['ideas']);
        },
    });
};

// Hooks for users
export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('users').select('*'))
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('users').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
};

// Hooks for notifications
export const useNotifications = () => useQuery({
    queryKey: ['notifications'],
    queryFn: () => fromSupabase(supabase.from('notifications').select('*'))
});

export const useAddNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newNotification) => fromSupabase(supabase.from('notifications').insert([newNotification])),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });
};

// Hooks for team_members
export const useTeamMembers = () => useQuery({
    queryKey: ['team_members'],
    queryFn: () => fromSupabase(supabase.from('team_members').select('*'))
});

export const useAddTeamMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTeamMember) => fromSupabase(supabase.from('team_members').insert([newTeamMember])),
        onSuccess: () => {
            queryClient.invalidateQueries(['team_members']);
        },
    });
};
