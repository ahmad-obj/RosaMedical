<?php

declare(strict_types=1);

namespace RosaMedical\Core\Admin;

use RosaMedical\Core\Catalogue\FamilyService;

final class CatalogueDashboardPage
{
    public static function render(): void
    {
        if (function_exists('current_user_can') && ! current_user_can(Capabilities::MANAGE_CONTENT)) {
            wp_die(__('You do not have permission to access this page.', 'rosa-medical'));
        }

        $service = new FamilyService();
        $families = $service->getFamilies(true);
        $totalFamilies = count($families);
        $totalProducts = 0;
        $totalWithPdf = 0;

        foreach ($families as $family) {
            $totalProducts += $family->productCount;
            if ($family->pdfId > 0) {
                $totalWithPdf++;
            }
        }

        $addFamilyUrl = admin_url('admin.php?page=rosa-medical-family-edit');
        $allProductsUrl = admin_url('edit.php?post_type=product');
        $addProductUrl = admin_url('post-new.php?post_type=product');
        ?>
        <div class="wrap rosa-admin-wrap rosa-catalogue-dashboard">
            <header class="rosa-admin-header">
                <div>
                    <p class="rosa-admin-eyebrow"><?php esc_html_e('ROSA MEDICAL', 'rosa-medical'); ?></p>
                    <h1 class="wp-heading-inline"><?php esc_html_e('Catalogue Overview', 'rosa-medical'); ?></h1>
                </div>
                <div class="rosa-admin-header-actions">
                    <a href="<?php echo esc_url($addFamilyUrl); ?>" class="button button-primary"><?php esc_html_e('Add New Family', 'rosa-medical'); ?></a>
                    <a href="<?php echo esc_url($addProductUrl); ?>" class="button button-secondary"><?php esc_html_e('Add Product', 'rosa-medical'); ?></a>
                    <a href="<?php echo esc_url($allProductsUrl); ?>" class="button button-secondary"><?php esc_html_e('View All Products in Woo', 'rosa-medical'); ?></a>
                </div>
            </header>

            <div class="rosa-dashboard-metrics">
                <div class="rosa-metric-card">
                    <span class="rosa-metric-value"><?php echo esc_html((string) $totalFamilies); ?></span>
                    <span class="rosa-metric-label"><?php esc_html_e('Catalogue Families', 'rosa-medical'); ?></span>
                </div>
                <div class="rosa-metric-card">
                    <span class="rosa-metric-value"><?php echo esc_html((string) $totalProducts); ?></span>
                    <span class="rosa-metric-label"><?php esc_html_e('Total Products', 'rosa-medical'); ?></span>
                </div>
                <div class="rosa-metric-card">
                    <span class="rosa-metric-value"><?php echo esc_html((string) $totalWithPdf); ?> / <?php echo esc_html((string) $totalFamilies); ?></span>
                    <span class="rosa-metric-label"><?php esc_html_e('PDF Catalogues Attached', 'rosa-medical'); ?></span>
                </div>
                <div class="rosa-metric-card">
                    <span class="rosa-metric-value"><?php esc_html_e('Active', 'rosa-medical'); ?></span>
                    <span class="rosa-metric-label"><?php esc_html_e('WooCommerce Dynamic Store', 'rosa-medical'); ?></span>
                </div>
            </div>

            <section class="rosa-admin-section">
                <div class="rosa-admin-section-header">
                    <h2><?php esc_html_e('Catalogue Families', 'rosa-medical'); ?></h2>
                    <p><?php esc_html_e('Families structure the public catalogue. Manage names, Arabic translations, cover artwork, and attached PDF catalogues below.', 'rosa-medical'); ?></p>
                </div>

                <?php if ($families === []) : ?>
                    <div class="rosa-admin-empty-state">
                        <p><?php esc_html_e('No catalogue families found yet.', 'rosa-medical'); ?></p>
                        <a href="<?php echo esc_url($addFamilyUrl); ?>" class="button button-primary"><?php esc_html_e('Create First Family', 'rosa-medical'); ?></a>
                    </div>
                <?php else : ?>
                    <table class="wp-list-table widefat fixed striped rosa-family-table">
                        <thead>
                            <tr>
                                <th style="width: 70px;"><?php esc_html_e('Cover', 'rosa-medical'); ?></th>
                                <th><?php esc_html_e('Family Name', 'rosa-medical'); ?></th>
                                <th><?php esc_html_e('Arabic Name', 'rosa-medical'); ?></th>
                                <th style="width: 100px;"><?php esc_html_e('Order', 'rosa-medical'); ?></th>
                                <th style="width: 90px;"><?php esc_html_e('Products', 'rosa-medical'); ?></th>
                                <th style="width: 120px;"><?php esc_html_e('PDF Status', 'rosa-medical'); ?></th>
                                <th style="width: 90px;"><?php esc_html_e('Visibility', 'rosa-medical'); ?></th>
                                <th style="width: 260px;"><?php esc_html_e('Actions', 'rosa-medical'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($families as $family) :
                                $editUrl = admin_url('admin.php?page=rosa-medical-family-edit&id=' . $family->id);
                                $wooProductsUrl = admin_url('edit.php?post_type=product&product_cat=' . $family->slug);
                                $wooAddProductUrl = admin_url('post-new.php?post_type=product');
                                $publicUrl = home_url('/shop/#family-' . $family->slug);
                            ?>
                                <tr>
                                    <td class="rosa-family-cover-cell">
                                        <?php if ($family->coverUrl !== '') : ?>
                                            <img src="<?php echo esc_url($family->coverUrl); ?>" alt="" class="rosa-family-thumb">
                                        <?php else : ?>
                                            <span class="rosa-family-thumb-placeholder dashicons dashicons-format-image"></span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <strong><a href="<?php echo esc_url($editUrl); ?>"><?php echo esc_html($family->name); ?></a></strong>
                                        <div class="row-actions"><span class="slug"><?php echo esc_html($family->slug); ?></span></div>
                                    </td>
                                    <td dir="rtl" style="text-align: right;">
                                        <?php echo esc_html($family->nameAr !== '' ? $family->nameAr : '—'); ?>
                                    </td>
                                    <td>
                                        <span class="rosa-order-badge"><?php echo esc_html((string) $family->order); ?></span>
                                    </td>
                                    <td>
                                        <a href="<?php echo esc_url($wooProductsUrl); ?>" class="rosa-count-badge">
                                            <?php echo esc_html((string) $family->productCount); ?>
                                        </a>
                                    </td>
                                    <td>
                                        <?php if ($family->pdfUrl !== '') : ?>
                                            <a href="<?php echo esc_url($family->pdfUrl); ?>" target="_blank" rel="noopener" class="button button-small">
                                                <span class="dashicons dashicons-pdf" style="vertical-align: middle; font-size: 16px;"></span> <?php esc_html_e('View PDF', 'rosa-medical'); ?>
                                            </a>
                                        <?php else : ?>
                                            <span class="description"><?php esc_html_e('None', 'rosa-medical'); ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($family->visible) : ?>
                                            <span class="rosa-badge rosa-badge--success"><?php esc_html_e('Public', 'rosa-medical'); ?></span>
                                        <?php else : ?>
                                            <span class="rosa-badge rosa-badge--muted"><?php esc_html_e('Hidden', 'rosa-medical'); ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="rosa-actions-cell">
                                        <a href="<?php echo esc_url($editUrl); ?>" class="button button-small button-primary"><?php esc_html_e('Edit', 'rosa-medical'); ?></a>
                                        <a href="<?php echo esc_url($wooProductsUrl); ?>" class="button button-small"><?php esc_html_e('Products', 'rosa-medical'); ?></a>
                                        <a href="<?php echo esc_url($publicUrl); ?>" target="_blank" rel="noopener" class="button button-small"><?php esc_html_e('View on Site', 'rosa-medical'); ?></a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </section>
        </div>
        <?php
    }
}
