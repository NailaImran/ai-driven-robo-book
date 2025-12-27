"""Initial database schema

Revision ID: 001
Revises:
Create Date: 2025-12-12

Creates tables:
- users: Authenticated learners and educators
- user_preferences: Personalization settings
- chat_history: RAG chatbot conversation logs
- content_metadata: Content versioning and embedding status
- technical_terms: English-Urdu glossary
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_email', 'users', ['email'])

    # Create user_preferences table
    op.create_table(
        'user_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('persona', sa.Enum('student', 'educator', 'self_learner', 'industry_professional', name='personaenum'), nullable=True),
        sa.Column('skill_level', sa.Enum('beginner', 'intermediate', 'advanced', name='skilllevelenum'), nullable=True),
        sa.Column('learning_pace', sa.Enum('accelerated', 'standard', 'extended', name='learningpaceenum'), nullable=True),
        sa.Column('language_preference', sa.String(5), nullable=False, server_default='en'),
        sa.Column('software_background', sa.Enum('none', 'basic_python', 'experienced_ros', 'professional', name='softwarebackgroundenum'), nullable=True),
        sa.Column('hardware_background', sa.Enum('simulation_only', 'jetson_kit', 'robot_lab', 'no_hardware', name='hardwarebackgroundenum'), nullable=True),
        sa.Column('learning_goal', sa.Enum('academic_course', 'self_study', 'professional_upskilling', name='learninggoalenum'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_user_preferences_id', 'user_preferences', ['id'])
    op.create_index('ix_user_preferences_user_id', 'user_preferences', ['user_id'])

    # Create chat_history table
    op.create_table(
        'chat_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('query', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=False),
        sa.Column('retrieved_chunks', postgresql.JSON(), nullable=True),
        sa.Column('response_time_ms', sa.Integer(), nullable=True),
        sa.Column('feedback_score', sa.Integer(), nullable=True),
        sa.Column('language', sa.String(5), nullable=False, server_default='en'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint('feedback_score >= 1 AND feedback_score <= 5', name='check_feedback_score_range'),
    )
    op.create_index('ix_chat_history_id', 'chat_history', ['id'])
    op.create_index('ix_chat_history_user_id', 'chat_history', ['user_id'])
    op.create_index('ix_chat_history_created_at', 'chat_history', ['created_at'], postgresql_using='btree', postgresql_ops={'created_at': 'DESC'})

    # Create content_metadata table
    op.create_table(
        'content_metadata',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('page_path', sa.String(500), nullable=False, unique=True),
        sa.Column('content_hash', sa.String(64), nullable=False),
        sa.Column('last_embedded_at', sa.DateTime(), nullable=True),
        sa.Column('chunk_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('module_name', sa.String(255), nullable=True),
        sa.Column('week_number', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_content_metadata_id', 'content_metadata', ['id'])
    op.create_index('ix_content_metadata_page_path', 'content_metadata', ['page_path'])
    op.create_index('ix_content_metadata_content_hash', 'content_metadata', ['content_hash'])

    # Create technical_terms table
    op.create_table(
        'technical_terms',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('english_term', sa.String(255), nullable=False, unique=True),
        sa.Column('urdu_term', sa.String(255), nullable=False),
        sa.Column('context', sa.Text(), nullable=True),
        sa.Column('category', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_technical_terms_id', 'technical_terms', ['id'])
    op.create_index('ix_technical_terms_english_term', 'technical_terms', ['english_term'])
    op.create_index('ix_technical_terms_category', 'technical_terms', ['category'])


def downgrade() -> None:
    # Drop tables in reverse order (respecting foreign keys)
    op.drop_table('technical_terms')
    op.drop_table('content_metadata')
    op.drop_table('chat_history')
    op.drop_table('user_preferences')
    op.drop_table('users')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS personaenum')
    op.execute('DROP TYPE IF EXISTS skilllevelenum')
    op.execute('DROP TYPE IF EXISTS learningpaceenum')
    op.execute('DROP TYPE IF EXISTS softwarebackgroundenum')
    op.execute('DROP TYPE IF EXISTS hardwarebackgroundenum')
    op.execute('DROP TYPE IF EXISTS learninggoalenum')
