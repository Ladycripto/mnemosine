use anchor_lang::prelude::*;

declare_id!("8WHFEQ7BdDhoKhdudmjnGwypsibeJjdRoTPgQg2AFrXH");

#[program]
pub mod mnemosine {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn register_image(ctx: Context<RegisterImage>, ipfs_hash: String, image_name: String) -> Result<()> {
        let image_record = &mut ctx.accounts.image_record;
        image_record.owner = ctx.accounts.owner.key();
        image_record.ipfs_hash = ipfs_hash.clone();
        image_record.image_name = image_name;
        image_record.timestamp = Clock::get()?.unix_timestamp;
        image_record.bump = ctx.bumps.image_record;
        
        msg!("Imagen registrada: {} por wallet: {}", image_record.ipfs_hash, image_record.owner);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(ipfs_hash: String)]
pub struct RegisterImage<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 64 + 64 + 8 + 1, // discriminator + owner + ipfs_hash + image_name + timestamp + bump
        seeds = [b"image_record", owner.key().as_ref(), &ipfs_hash.as_bytes()[..8]],
        bump
    )]
    pub image_record: Account<'info, ImageRecord>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ImageRecord {
    pub owner: Pubkey,        // 32 bytes
    pub ipfs_hash: String,    // 64 bytes (máximo)
    pub image_name: String,   // 64 bytes (máximo)
    pub timestamp: i64,       // 8 bytes
    pub bump: u8,             // 1 byte
}
