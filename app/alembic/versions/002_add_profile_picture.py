"""Add profile_picture column to users

Revision ID: 002_add_profile_picture
Revises: 001_initial_schema
Create Date: 2026-02-19

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_add_profile_picture'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    # Add profile_picture column to users table
    op.add_column('users', sa.Column('profile_picture', sa.String(), nullable=True))


def downgrade():
    # Remove profile_picture column
    op.drop_column('users', 'profile_picture')
