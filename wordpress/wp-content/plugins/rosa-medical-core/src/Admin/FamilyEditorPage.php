<?php

declare(strict_types=1);

namespace RosaMedical\Core\Admin;

use RosaMedical\Core\Catalogue\FamilyModel;
use RosaMedical\Core\Catalogue\FamilyService;

final class FamilyEditorPage
{
    public static function render(?int $explicitId = null): void
    {
        if (function_exists('current_user_can') && ! current_user_can(Capabilities::MANAGE_CONTENT)) {
            wp_die(__('You do not have permission to access this page.', 'rosa-medical'));
        }

        $service = new FamilyService();
        $message = '';
        $error = '';

        // Process POST submissions
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $action = isset($_POST['rosa_family_action']) ? sanitize_text_field((string) $_POST['rosa_family_action']) : '';

            if ($action === 'save') {
                $nonce = isset($_POST['rosa_family_nonce']) ? (string) $_POST['rosa_family_nonce'] : '';
                if (! function_exists('wp_verify_nonce') || ! wp_verify_nonce($nonce, 'rosa_save_family')) {
                    $error = __('Security check failed. Please refresh and try again.', 'rosa-medical');
                } else {
                    $saveData = [
                        'id' => isset($_POST['family_id']) ? (int) $_POST['family_id'] : 0,
                        'name' => isset($_POST['name']) ? sanitize_text_field((string) $_POST['name']) : '',
                        'name_ar' => isset($_POST['name_ar']) ? sanitize_text_field((string) $_POST['name_ar']) : '',
                        'slug' => isset($_POST['slug']) ? sanitize_text_field((string) $_POST['slug']) : '',
                        'order' => isset($_POST['order']) ? (int) $_POST['order'] : 0,
                        'visible' => isset($_POST['visible']) ? 1 : 0,
                        'description' => isset($_POST['description']) ? wp_kses_post((string) $_POST['description']) : '',
                        'description_ar' => isset($_POST['description_ar']) ? wp_kses_post((string) $_POST['description_ar']) : '',
                        'cover_id' => isset($_POST['cover_id']) ? (int) $_POST['cover_id'] : 0,
                        'pdf_id' => isset($_POST['pdf_id']) ? (int) $_POST['pdf_id'] : 0,
                    ];

                    $result = $service->saveFamily($saveData);
                    if (function_exists('is_wp_error') && is_wp_error($result)) {
                        $error = $result->get_error_message();
                    } else {
                        $message = __('Family saved successfully.', 'rosa-medical');
                        $explicitId = (int) $result;
                    }
                }
            } elseif ($action === 'delete') {
                $nonce = isset($_POST['rosa_family_delete_nonce']) ? (string) $_POST['rosa_family_delete_nonce'] : '';
                if (! function_exists('wp_verify_nonce') || ! wp_verify_nonce($nonce, 'rosa_delete_family')) {
                    $error = __('Security check failed. Please refresh and try again.', 'rosa-medical');
                } else {
                    $targetTermId = isset($_POST['family_id']) ? (int) $_POST['family_id'] : 0;
                    $reassignId = isset($_POST['reassign_term_id']) ? (int) $_POST['reassign_term_id'] : 0;
                    $result = $service->deleteFamily($targetTermId, $reassignId);
                    if (function_exists('is_wp_error') && is_wp_error($result)) {
                        $error = $result->get_error_message();
                    } else {
                        if (function_exists('wp_safe_redirect')) {
                            wp_safe_redirect(admin_url('admin.php?page=rosa-medical-catalogue&deleted=1'));
                            exit;
                        }
                        $message = __('Family deleted successfully.', 'rosa-medical');
                        $explicitId = 0;
                    }
                }
            }
        }

        $id = $explicitId ?? (isset($_GET['id']) ? max(0, (int) $_GET['id']) : 0);
        $family = $id > 0 ? $service->getFamily($id) : null;
        $isEdit = $family instanceof FamilyModel;
        $allFamilies = $service->getFamilies(true);

        $name = $isEdit ? $family->name : '';
        $nameAr = $isEdit ? $family->nameAr : '';
        $slug = $isEdit ? $family->slug : '';
        $order = $isEdit ? $family->order : 0;
        $visible = ! $isEdit || $family->visible;
        $description = $isEdit ? $family->description : '';
        $descriptionAr = $isEdit ? $family->descriptionAr : '';
        $coverId = $isEdit ? $family->coverId : 0;
        $coverUrl = $isEdit ? $family->coverUrl : '';
        $pdfId = $isEdit ? $family->pdfId : 0;
        $pdfUrl = $isEdit ? $family->pdfUrl : '';
        $productCount = $isEdit ? $family->productCount : 0;

        $backUrl = admin_url('admin.php?page=rosa-medical-catalogue');
        ?>
        <div class="wrap rosa-admin-wrap rosa-family-editor">
            <header class="rosa-admin-header">
                <div>
                    <p class="rosa-admin-eyebrow">
                        <a href="<?php echo esc_url($backUrl); ?>">&larr; <?php esc_html_e('Back to Catalogue Overview', 'rosa-medical'); ?></a>
                    </p>
                    <h1 class="wp-heading-inline">
                        <?php echo esc_html($isEdit ? sprintf(__('Edit Family: %s', 'rosa-medical'), $name) : __('Add New Family', 'rosa-medical')); ?>
                    </h1>
                </div>
                <?php if ($isEdit) : ?>
                    <div class="rosa-admin-header-actions">
                        <a href="<?php echo esc_url(admin_url('edit.php?post_type=product&product_cat=' . $slug)); ?>" class="button button-secondary">
                            <?php echo esc_html(sprintf(__('Manage %d Products', 'rosa-medical'), $productCount)); ?>
                        </a>
                        <a href="<?php echo esc_url(home_url('/shop/#family-' . $slug)); ?>" target="_blank" rel="noopener" class="button button-secondary">
                            <?php esc_html_e('View on Site', 'rosa-medical'); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </header>

            <?php if ($message !== '') : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html($message); ?></p></div>
            <?php endif; ?>
            <?php if ($error !== '') : ?>
                <div class="notice notice-error is-dismissible"><p><?php echo esc_html($error); ?></p></div>
            <?php endif; ?>

            <form method="post" action="" class="rosa-family-form">
                <input type="hidden" name="rosa_family_action" value="save">
                <input type="hidden" name="family_id" value="<?php echo esc_attr((string) $id); ?>">
                <?php if (function_exists('wp_nonce_field')) { wp_nonce_field('rosa_save_family', 'rosa_family_nonce'); } ?>

                <div class="rosa-editor-columns">
                    <div class="rosa-editor-main">
                        <div class="rosa-admin-card">
                            <h2><?php esc_html_e('Family Identity & Labels', 'rosa-medical'); ?></h2>

                            <table class="form-table" role="presentation">
                                <tr>
                                    <th scope="row"><label for="family-name"><?php esc_html_e('Family Name (EN)', 'rosa-medical'); ?> <span class="required">*</span></label></th>
                                    <td>
                                        <input name="name" type="text" id="family-name" value="<?php echo esc_attr($name); ?>" class="regular-text" required placeholder="e.g. Scissors">
                                        <p class="description"><?php esc_html_e('The primary English name shown in catalogue sections and WooCommerce taxonomy.', 'rosa-medical'); ?></p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="family-name-ar"><?php esc_html_e('Arabic Display Name (AR)', 'rosa-medical'); ?></label></th>
                                    <td>
                                        <input name="name_ar" type="text" id="family-name-ar" dir="rtl" value="<?php echo esc_attr($nameAr); ?>" class="regular-text" placeholder="مثال: المقصات">
                                        <p class="description"><?php esc_html_e('Displayed on public Arabic pages and RTL navigation. Falls back to English name if left empty.', 'rosa-medical'); ?></p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="family-slug"><?php esc_html_e('Slug', 'rosa-medical'); ?></label></th>
                                    <td>
                                        <input name="slug" type="text" id="family-slug" value="<?php echo esc_attr($slug); ?>" class="regular-text" placeholder="e.g. scissors">
                                        <p class="description"><?php esc_html_e('The URL-friendly identifier used for category archives and anchor links (#family-slug).', 'rosa-medical'); ?></p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="family-description"><?php esc_html_e('Description (EN)', 'rosa-medical'); ?></label></th>
                                    <td>
                                        <textarea name="description" id="family-description" rows="3" class="large-text" placeholder="Surgical instruments organized by pattern..."><?php echo esc_textarea($description); ?></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="family-description-ar"><?php esc_html_e('Description (AR)', 'rosa-medical'); ?></label></th>
                                    <td>
                                        <textarea name="description_ar" id="family-description-ar" dir="rtl" rows="3" class="large-text" placeholder="أدوات جراحية مصنفة حسب النمط..."><?php echo esc_textarea($descriptionAr); ?></textarea>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="rosa-admin-card">
                            <h2><?php esc_html_e('Media & Catalogue PDF', 'rosa-medical'); ?></h2>

                            <table class="form-table" role="presentation">
                                <tr>
                                    <th scope="row"><?php esc_html_e('Family Cover Artwork', 'rosa-medical'); ?></th>
                                    <td>
                                        <div class="rosa-media-picker-group" data-rosa-picker-group="cover">
                                            <input type="hidden" name="cover_id" id="family-cover-id" value="<?php echo esc_attr((string) $coverId); ?>">
                                            <div class="rosa-media-preview rosa-cover-preview" id="family-cover-preview">
                                                <?php if ($coverUrl !== '') : ?>
                                                    <img src="<?php echo esc_url($coverUrl); ?>" alt="" style="max-height: 120px; max-width: 100%;">
                                                <?php else : ?>
                                                    <span class="description"><?php esc_html_e('No cover image selected.', 'rosa-medical'); ?></span>
                                                <?php endif; ?>
                                            </div>
                                            <div class="rosa-media-actions" style="margin-top: 8px;">
                                                <button type="button" class="button rosa-media-button" data-rosa-media-picker="image" data-target-input="#family-cover-id" data-target-preview="#family-cover-preview">
                                                    <?php esc_html_e('Select / Upload Image', 'rosa-medical'); ?>
                                                </button>
                                                <button type="button" class="button rosa-media-clear" data-target-input="#family-cover-id" data-target-preview="#family-cover-preview" <?php echo $coverId > 0 ? '' : 'style="display:none;"'; ?>>
                                                    <?php esc_html_e('Remove', 'rosa-medical'); ?>
                                                </button>
                                            </div>
                                            <p class="description"><?php esc_html_e('Displayed on homepage discovery and catalogue navigation. Synced with WooCommerce category thumbnail.', 'rosa-medical'); ?></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><?php esc_html_e('Catalogue PDF Attachment', 'rosa-medical'); ?></th>
                                    <td>
                                        <div class="rosa-media-picker-group" data-rosa-picker-group="pdf">
                                            <input type="hidden" name="pdf_id" id="family-pdf-id" value="<?php echo esc_attr((string) $pdfId); ?>">
                                            <div class="rosa-media-preview rosa-pdf-preview" id="family-pdf-preview">
                                                <?php if ($pdfUrl !== '') : ?>
                                                    <a href="<?php echo esc_url($pdfUrl); ?>" target="_blank" rel="noopener" class="button button-small">
                                                        <span class="dashicons dashicons-pdf" style="vertical-align: middle;"></span> <?php echo esc_html(basename($pdfUrl)); ?>
                                                    </a>
                                                <?php else : ?>
                                                    <span class="description"><?php esc_html_e('No catalogue PDF attached.', 'rosa-medical'); ?></span>
                                                <?php endif; ?>
                                            </div>
                                            <div class="rosa-media-actions" style="margin-top: 8px;">
                                                <button type="button" class="button rosa-media-button" data-rosa-media-picker="pdf" data-target-input="#family-pdf-id" data-target-preview="#family-pdf-preview">
                                                    <?php esc_html_e('Select / Upload PDF', 'rosa-medical'); ?>
                                                </button>
                                                <button type="button" class="button rosa-media-clear" data-target-input="#family-pdf-id" data-target-preview="#family-pdf-preview" <?php echo $pdfId > 0 ? '' : 'style="display:none;"'; ?>>
                                                    <?php esc_html_e('Remove', 'rosa-medical'); ?>
                                                </button>
                                            </div>
                                            <p class="description"><?php esc_html_e('Powers the "Download PDF Catalogue" button in public catalogue sections and homepage carousel.', 'rosa-medical'); ?></p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div class="rosa-editor-sidebar">
                        <div class="rosa-admin-card">
                            <h2><?php esc_html_e('Display & Sorting', 'rosa-medical'); ?></h2>
                            <p>
                                <label for="family-order"><strong><?php esc_html_e('Sort Order (Rank)', 'rosa-medical'); ?></strong></label><br>
                                <input name="order" type="number" id="family-order" value="<?php echo esc_attr((string) $order); ?>" style="width: 100px;">
                            </p>
                            <p class="description"><?php esc_html_e('Lower numbers appear first in the public catalogue sections and navigation rail.', 'rosa-medical'); ?></p>
                            <hr>
                            <p>
                                <label>
                                    <input name="visible" type="checkbox" value="1" <?php checked($visible); ?>>
                                    <strong><?php esc_html_e('Publicly Visible', 'rosa-medical'); ?></strong>
                                </label>
                            </p>
                            <p class="description"><?php esc_html_e('When unchecked, this family and its public section are hidden from public visitors.', 'rosa-medical'); ?></p>
                            <hr>
                            <p>
                                <button type="submit" class="button button-primary button-large" style="width: 100%;">
                                    <?php echo esc_html($isEdit ? __('Save Changes', 'rosa-medical') : __('Create Family', 'rosa-medical')); ?>
                                </button>
                            </p>
                        </div>

                        <?php if ($isEdit) : ?>
                            <div class="rosa-admin-card rosa-danger-zone">
                                <h2><?php esc_html_e('Delete Family', 'rosa-medical'); ?></h2>
                                <p><?php esc_html_e('Deleting a family does not delete its products. Products will remain safe in WooCommerce.', 'rosa-medical'); ?></p>
                                <button type="button" class="button button-link-delete" onclick="document.getElementById('rosa-delete-modal').style.display='block';">
                                    <?php esc_html_e('Delete this family...', 'rosa-medical'); ?>
                                </button>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </form>

            <?php if ($isEdit) : ?>
                <div id="rosa-delete-modal" class="rosa-modal" style="display:none;">
                    <div class="rosa-modal-content">
                        <h2><?php esc_html_e('Confirm Family Deletion', 'rosa-medical'); ?></h2>
                        <p><?php echo esc_html(sprintf(__('Are you sure you want to delete family "%s"?', 'rosa-medical'), $name)); ?></p>

                        <form method="post" action="">
                            <input type="hidden" name="rosa_family_action" value="delete">
                            <input type="hidden" name="family_id" value="<?php echo esc_attr((string) $id); ?>">
                            <?php if (function_exists('wp_nonce_field')) { wp_nonce_field('rosa_delete_family', 'rosa_family_delete_nonce'); } ?>

                            <?php if ($productCount > 0) : ?>
                                <p><strong><?php echo esc_html(sprintf(__('This family currently contains %d products. What should happen to them?', 'rosa-medical'), $productCount)); ?></strong></p>
                                <p>
                                    <label>
                                        <input type="radio" name="reassign_mode" value="none" checked onclick="document.getElementById('reassign-picker').style.display='none';">
                                        <?php esc_html_e('Leave products without this family (safe, unassigned)', 'rosa-medical'); ?>
                                    </label>
                                </p>
                                <p>
                                    <label>
                                        <input type="radio" name="reassign_mode" value="reassign" onclick="document.getElementById('reassign-picker').style.display='block';">
                                        <?php esc_html_e('Reassign all products to another family:', 'rosa-medical'); ?>
                                    </label>
                                </p>
                                <div id="reassign-picker" style="display:none; margin-left: 20px;">
                                    <select name="reassign_term_id">
                                        <?php foreach ($allFamilies as $otherFamily) : ?>
                                            <?php if ($otherFamily->id !== $id) : ?>
                                                <option value="<?php echo esc_attr((string) $otherFamily->id); ?>"><?php echo esc_html($otherFamily->name); ?></option>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            <?php else : ?>
                                <p class="description"><?php esc_html_e('This family currently contains 0 products.', 'rosa-medical'); ?></p>
                            <?php endif; ?>

                            <div style="margin-top: 20px; display: flex; gap: 10px;">
                                <button type="submit" class="button button-danger" style="background: #b32d2e; color: #fff; border-color: #b32d2e;">
                                    <?php esc_html_e('Permanently Delete Family', 'rosa-medical'); ?>
                                </button>
                                <button type="button" class="button button-secondary" onclick="document.getElementById('rosa-delete-modal').style.display='none';">
                                    <?php esc_html_e('Cancel', 'rosa-medical'); ?>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
}
