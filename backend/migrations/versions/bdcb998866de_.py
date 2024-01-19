"""empty message

Revision ID: bdcb998866de
Revises: 1db273410c11
Create Date: 2024-01-18 14:01:35.572002

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'bdcb998866de'
down_revision = '1db273410c11'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('paciente', schema=None) as batch_op:
        batch_op.drop_column('tipo_paciente')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('paciente', schema=None) as batch_op:
        batch_op.add_column(sa.Column('tipo_paciente', mysql.VARCHAR(length=20), nullable=False))

    # ### end Alembic commands ###